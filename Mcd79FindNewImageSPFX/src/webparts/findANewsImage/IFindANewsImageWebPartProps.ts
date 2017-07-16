import {IImage} from './PropertyFields/PropertyFieldImagePicker';

export interface IFindANewsImageWebPartProps {
  imageSearchText: string;
  imageExternalLocation: string;
  imageLocation: IImage;
  functionUrl: string;
  listName: string;
  imageSourceType: string;
  siteId: string;
  webId: string;
  listId:string;
  uniqueId:string;
  altText: string;
  fileName: string;
  imgWidth: number;
  imgHeight: number;
}
