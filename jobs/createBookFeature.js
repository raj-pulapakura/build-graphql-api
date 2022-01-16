const { resolve } = require("path");
const { writeFile, mkdir } = require("fs").promises;

module.exports.createBookFeature = async (dir) => {
  await mkdir(resolve(dir, "src", "features", "Book"));
  await mkdir(resolve(dir, "src", "features", "Book", "inputs"));
  await mkdir(resolve(dir, "src", "features", "Book", "objects"));

  const files = [
    {
      path: resolve(
        dir,
        "src",
        "features",
        "Book",
        "inputs",
        "CreateBookInput.ts"
      ),
      data: `import { Field, Float, ID, InputType } from "type-graphql";

@InputType()
export class CreateBookInput {
  @Field(() => String)
  title!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => ID)
  authorId!: string;
}
`,
    },
    {
      path: resolve(
        dir,
        "src",
        "features",
        "Book",
        "inputs",
        "UpdateBookInput.ts"
      ),
      data: `import { Field, Float, ID, InputType } from "type-graphql";

@InputType()
export class UpdateBookInput {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => ID, { nullable: true })
  authorId?: string;
}
`,
    },
    {
      path: resolve(
        dir,
        "src",
        "features",
        "Book",
        "objects",
        "BookGeneralResponse.ts"
      ),
      data: `import { Field, ObjectType } from "type-graphql";
import { FieldError } from "../../../objects/FieldError";
import { BookGraphql } from "../BookGraphql";

@ObjectType()
export class BookGeneralResponse {
  @Field(() => BookGraphql, { nullable: true })
  book?: BookGraphql;

  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
}
`,
    },
    {
      path: resolve(dir, "src", "features", "Book", "BookEntity.ts"),
      data: `import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "../../objects/BaseModel";
import { AuthorEntity } from "../Author/AuthorEntity";

@Entity()
export class BookEntity extends BaseModel {
  @Column({ type: "text" })
  title!: string;

  @Column({ type: "float" })
  price!: number;

  @Column({ type: "varchar" })
  authorId!: string;

  @ManyToOne(() => AuthorEntity, (author) => author.books, {
    onDelete: "CASCADE",
  })
  author!: AuthorEntity;
}
`,
    },
    {
      path: resolve(dir, "src", "features", "Book", "BookGraphql.ts"),
      data: `import { Field, Float, ObjectType } from "type-graphql";
import { BaseGraphql } from "../../objects/BaseGraphql";
import { AuthorGraphql } from "../Author/AuthorGraphql";

@ObjectType()
export class BookGraphql extends BaseGraphql {
  @Field(() => String)
  title!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => AuthorGraphql)
  author!: AuthorGraphql;
}
`,
    },
    {
      path: resolve(dir, "src", "features", "Book", "BookResolver.ts"),
      data: `import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { BookGraphql } from "./BookGraphql";
import { BookService } from "./BookService";
import { CreateBookInput } from "./inputs/CreateBookInput";
import { UpdateBookInput } from "./inputs/UpdateBookInput";
import { BookGeneralResponse } from "./objects/BookGeneralResponse";

@Resolver()
export class BookResolver {
  @Query(() => [BookGraphql])
  books(): Promise<BookGraphql[]> {
    return BookService.fetchBooks();
  }

  @Query(() => BookGeneralResponse)
  book(@Arg("bookId", () => ID) bookId: string): Promise<BookGeneralResponse> {
    return BookService.fetchBook(bookId);
  }

  @Mutation(() => BookGeneralResponse)
  createBook(
    @Arg("input", () => CreateBookInput) createBookInput: CreateBookInput
  ): Promise<BookGeneralResponse> {
    const { title, price, authorId } = createBookInput;
    return BookService.createBook(title, price, authorId);
  }

  @Mutation(() => Boolean)
  updateBook(
    @Arg("input", () => UpdateBookInput) updateBookInput: UpdateBookInput
  ): Promise<Boolean> {
    const { id, title, price, authorId } = updateBookInput;
    return BookService.updateBook(id, title, price, authorId);
  }

  @Mutation(() => Boolean)
  deleteBook(@Arg("bookId", () => ID) bookId: string): Promise<Boolean> {
    return BookService.deleteBook(bookId);
  }
}
`,
    },
    {
      path: resolve(dir, "src", "features", "Book", "BookService.ts"),
      data: `import { AuthorEntity } from "../Author/AuthorEntity";
import { BookEntity } from "./BookEntity";
import { BookGraphql } from "./BookGraphql";
import { BookGeneralResponse } from "./objects/BookGeneralResponse";

export class BookService {
  static async createBook(
    title: string,
    price: number,
    authorId: string
  ): Promise<BookGeneralResponse> {
    const author = await AuthorEntity.findOne(authorId);
    if (!author) {
      return {
        error: {
          field: "authorId",
          message: "an author with that id does not exist",
          ufm: "an author with that id does not exist",
        },
      };
    }

    const book = await BookEntity.create({ title, price, authorId }).save();

    return {
      book: {
        ...book,
        author,
      },
    };
  }

  static async fetchBooks(): Promise<BookGraphql[]> {
    const bookIds = (await BookEntity.find({})).map((book) => book.id);
    const bookGraphqls: BookGraphql[] = [];
    for (const bookId of bookIds) {
      const book = await this.fetchBook(bookId);
      if (book.error || !book.book) {
        continue;
      }
      bookGraphqls.push(book.book);
    }
    return bookGraphqls;
  }

  static async fetchBook(bookId: string): Promise<BookGeneralResponse> {
    const book = await BookEntity.findOne(bookId);
    if (!book) {
      return {
        error: {
          field: "bookId",
          message: "a book with that id does not exist",
          ufm: "A book with that id does not exist",
        },
      };
    }
    const author = await AuthorEntity.findOne(book.authorId);
    if (!author) {
      return {
        error: {
          field: "book.authorId",
          message: "an author with that authorId does not exist",
          ufm: "An author with that authorId does not exist",
        },
      };
    }
    return {
      book: {
        ...book,
        author,
      },
    };
  }

  static async deleteBook(bookId: string): Promise<Boolean> {
    try {
      await BookEntity.delete(bookId);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async updateBook(
    id: string,
    title: string | undefined,
    price: number | undefined,
    authorId: string | undefined
  ): Promise<Boolean> {
    const entity: { title?: string; price?: number; authorId?: string } = {};
    if (title) {
      entity.title = title;
    }
    if (price) {
      entity.price = price;
    }
    if (authorId) {
      entity.authorId = authorId;
    }

    try {
      await BookEntity.update(id, entity);
      return true;
    } catch (e) {
      return false;
    }
  }
}
`,
    },
  ];

  for (const file of files) {
    await writeFile(file.path, file.data, { encoding: "utf-8" });
  }
};
