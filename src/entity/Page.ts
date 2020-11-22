import 'reflect-metadata';
import { Field, Int, ObjectType } from 'type-graphql';
import { IPage } from '@/models/IPage';

@ObjectType()
export class Page implements IPage {
  constructor(
    public templateId: string,
    title: string,
    width: number,
    height: number,
    imageUrl: string,
  ) {
    this.title = title;
    this.width = width;
    this.height = height;
    this.imageUrl = imageUrl;
  }

  @Field()
  title: string;

  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field()
  imageUrl: string;
}
