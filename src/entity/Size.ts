import { ISize } from '@/models/ISize';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Size implements ISize {
  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  @Field()
  id: string

  @Field()
  title: string
}
