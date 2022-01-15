const { resolve } = require("path");
const { writeFile, mkdir } = require("fs").promises;

module.exports.createAuthorFeature = async (dir) => {
  await mkdir(resolve(dir, "src", "features", "Author"));
  await mkdir(resolve(dir, "src", "features", "Author", "inputs"));
  await mkdir(resolve(dir, "src", "features", "Author", "objects"));

  const files = [
    {
      path: resolve(
        dir,
        "src",
        "features",
        "Author",
        "inputs",
        "CreateAuthorInput.ts"
      ),
      data: `import { Field, InputType } from "type-graphql";

@InputType()
export class CreateAuthorInput {
  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;
}

`,
    },
    {
      path: resolve(
        dir,
        "src",
        "features",
        "Author",
        "inputs",
        "UpdateAuthorInput.ts"
      ),
      data: `import { Field, ID, InputType } from "type-graphql";

@InputType()
export class UpdateAuthorInput {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;
}

`,
    },
    {
      path: resolve(
        dir,
        "src",
        "features",
        "Author",
        "objects",
        "AuthorGeneralResponse.ts"
      ),
      data: `import { Field, ObjectType } from "type-graphql";
import { FieldError } from "../../../objects/FieldError";
import { AuthorGraphql } from "../AuthorGraphql";

@ObjectType()
export class AuthorGeneralResponse {
  @Field(() => AuthorGraphql, { nullable: true })
  author?: AuthorGraphql;

  @Field(() => FieldError, { nullable: true })
  error?: FieldError;
}

`,
    },
    {
      path: resolve(dir, "src", "features", "Author", "AuthorEntity.ts"),
      data: `import { Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from "../../objects/BaseModel";
import { BookEntity } from "../Book/BookEntity";

@Entity()
export class AuthorEntity extends BaseModel {
  @Column({ type: "varchar" })
  firstName!: string;

  @Column({ type: "varchar" })
  lastName!: string;

  @OneToMany(() => BookEntity, (book) => book.author, { onDelete: "CASCADE" })
  books!: BookEntity[];
}

`,
    },
    {
      path: resolve(dir, "src", "features", "Author", "AuthorGraphql.ts"),
      data: `import { Field, ObjectType } from "type-graphql";
import { BaseGraphql } from "../../objects/BaseGraphql";
import { BookGraphql } from "../Book/BookGraphql";

@ObjectType()
export class AuthorGraphql extends BaseGraphql {
  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => [BookGraphql])
  books!: BookGraphql[];
}

`,
    },
    {
      path: resolve(dir, "src", "features", "Author", "AuthorResolver.ts"),
      data: `import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { AuthorGraphql } from "./AuthorGraphql";
import { AuthorService } from "./AuthorService";
import { CreateAuthorInput } from "./inputs/CreateAuthorInput";
import { UpdateAuthorInput } from "./inputs/UpdateAuthorInput";
import { AuthorGeneralResponse } from "./objects/AuthorGeneralResponse";

@Resolver()
export class AuthorResolver {
  @Query(() => [AuthorGraphql])
  authors(): Promise<AuthorGraphql[]> {
    return AuthorService.fetchAuthors();
  }

  @Query(() => AuthorGeneralResponse)
  author(
    @Arg("authorId", () => ID) authorId: string
  ): Promise<AuthorGeneralResponse> {
    return AuthorService.fetchAuthor(authorId);
  }

  @Mutation(() => AuthorGeneralResponse)
  createAuthor(
    @Arg("input", () => CreateAuthorInput) createAuthorInput: CreateAuthorInput
  ): Promise<AuthorGeneralResponse> {
    const { firstName, lastName } = createAuthorInput;
    return AuthorService.createAuthor(firstName, lastName);
  }

  @Mutation(() => Boolean)
  updateAuthor(
    @Arg("input", () => UpdateAuthorInput) updateAuthorInput: UpdateAuthorInput
  ): Promise<Boolean> {
    const { id, firstName, lastName } = updateAuthorInput;
    return AuthorService.updateAuthor(id, firstName, lastName);
  }

  @Mutation(() => Boolean)
  deleteAuthor(@Arg("authorId", () => ID) authorId: string): Promise<Boolean> {
    return AuthorService.deleteAuthor(authorId);
  }
}

`,
    },
    {
      path: resolve(dir, "src", "features", "Author", "AuthorService.ts"),
      data: `import { BookEntity } from "../Book/BookEntity";
import { AuthorEntity } from "./AuthorEntity";
import { AuthorGraphql } from "./AuthorGraphql";
import { AuthorGeneralResponse } from "./objects/AuthorGeneralResponse";

export class AuthorService {
  static async createAuthor(
    firstName: string,
    lastName: string
  ): Promise<AuthorGeneralResponse> {
    const author = await AuthorEntity.create({ firstName, lastName }).save();
    const books = await BookEntity.find({ where: { authorId: author.id } });
    return { author: { ...author, books } };
  }

  static async fetchAuthors(): Promise<AuthorGraphql[]> {
    const authorIds = (await AuthorEntity.find({})).map((author) => author.id);
    const authorGraphqls: AuthorGraphql[] = [];
    for (const id of authorIds) {
      const author = await this.fetchAuthor(id);
      if (author.error || !author.author) {
        continue;
      }
      authorGraphqls.push(author.author);
    }
    return authorGraphqls;
  }

  static async fetchAuthor(authorId: string): Promise<AuthorGeneralResponse> {
    const author = await AuthorEntity.findOne(authorId);
    if (!author) {
      return {
        error: {
          field: "authorId",
          message: "an author with that id does not exist",
          ufm: "An author with that id does not exists",
        },
      };
    }

    const books = await BookEntity.find({ where: { authorId: author.id } });
    return {
      author: {
        ...author,
        books,
      },
    };
  }

  static async deleteAuthor(authorId: string): Promise<Boolean> {
    try {
      await AuthorEntity.delete(authorId);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async updateAuthor(
    authorId: string,
    firstName?: string,
    lastName?: string
  ): Promise<Boolean> {
    const entity: { firstName?: string; lastName?: string } = {};
    if (firstName) {
      entity.firstName = firstName;
    }
    if (lastName) {
      entity.lastName = lastName;
    }

    try {
      await AuthorEntity.update(authorId, entity);
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
