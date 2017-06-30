declare interface IFindANewsImageStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ImageSearchTextLabel: string;
  ImageExternalLocationLabel: string;
  ImageLocationLabel: string;
  FunctionUrlLabel: string;
}

declare module 'findANewsImageStrings' {
  const strings: IFindANewsImageStrings;
  export = strings;
}
