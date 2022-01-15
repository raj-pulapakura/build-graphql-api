const { writeFile } = require("fs").promises;
const { resolve } = require("path");

module.exports.createObjects = async (dir) => {
  // create objects/BaseGraphql.ts
  await writeFile(
    resolve(dir, "src", "objects", "BaseGraphql.ts"),
    `import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export abstract class BaseGraphql {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  createdAt!: Date;

  @Field(() => String)
  updatedAt!: Date;
}
`,
    {
      encoding: "utf-8",
    }
  );

  // create objects/BaseModel.ts
  await writeFile(
    resolve(dir, "src", "objects", "BaseModel.ts"),
    `import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
`,
    {
      encoding: "utf-8",
    }
  );

  // create objects/FieldError.ts
  await writeFile(
    resolve(dir, "src", "objects", "FieldError.ts"),
    `import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field(() => String)
  field!: string;

  @Field(() => String)
  message!: string;

  @Field(() => String)
  ufm!: String; // user friendly message
}
`,
    {
      encoding: "utf-8",
    }
  );
};
