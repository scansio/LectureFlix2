export default interface IArticle {
  content: string;
  published: boolean;
  slug: string;
  coverImageUrl: string;
  seoDescription: string;
  title: string;
  tags: string[];
  likeByIds: number[];
  numComments: number;
  _id: string;
  readingTimeInMinute: number;
  author: {
    _id: number;
    firstname: string;
    lastname: string;
    slug: string;
    avatar: string;
    bio: string;
  };
  createdAt: {
    dateString: string;
  };
  status: number;
}
