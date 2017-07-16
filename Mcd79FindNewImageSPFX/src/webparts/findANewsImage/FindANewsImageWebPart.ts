import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { PropertyFieldImagePicker } from './PropertyFields/PropertyFieldImagePicker';
import * as pnp from 'sp-pnp-js';
import * as strings from 'findANewsImageStrings';
import FindANewsImage from './components/FindANewsImage';
import { IFindANewsImageProps } from './components/IFindANewsImageProps';
import { IFindANewsImageWebPartProps } from './IFindANewsImageWebPartProps';
import {IListItem } from './IListItem';
import * as $ from 'jQuery';

const functionUrl: string = 'https://functionurlhere';//SET FunctionUrl here

export default class FindANewsImageWebPart extends BaseClientSideWebPart<IFindANewsImageWebPartProps> {
  protected get previewImageUrl(): string {
		return this.properties.imageLocation.thumbnailUrl;
	}

private pageName: string;

protected onInit(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error?: any) => void): void => {
      pnp.setup({
        spfxContext: this.context
      });
      
      resolve();
    });
  }

  public render(): void {
    
    if (this.properties.imageLocation == undefined || this.properties.imageLocation.contentUrl == '') {
      this.properties.imageLocation = {
          imageId: '-1',
          name: 'Image',
          contentUrl: '',
          thumbnailUrl: ''
        };
      var itemId = this.context.pageContext.listItem.id;
      var self = this;
      pnp.sp.web.lists.getByTitle('Site Pages')
      .items.getById(itemId).get(undefined, {
        headers: {
          'Accept': 'application/json;odata=minimalmetadata'
        }
      })
      .then((item: IListItem) => {
      this.properties.imageLocation = {
          imageId: '-1',
          name: item.Title,
          contentUrl: '',
          thumbnailUrl: ''
        };
    console.log('Setting element');
    
    });
  }
  const element: React.ReactElement<IFindANewsImageProps > = React.createElement(
      FindANewsImage,
      {
        imageSearchText: this.properties.imageSearchText,
        imageExternalLocation: this.properties.imageExternalLocation,
        imageLocation: this.properties.imageLocation,
        functionUrl: functionUrl
      }
    );
    
    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


  selectedImageChanged(propertyPath: string, oldValue: any, newValue: any) {
    console.log('Property path: ' + propertyPath);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

   
      
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
               /*  PropertyPaneTextField('functionUrl', {
                  label: strings.FunctionUrlLabel
                }),*/
                PropertyFieldImagePicker('imageLocation', {

                  label: 'Select a picture',
                  initialValue: {
                    imageId: '-1',
                    name: 'find a picture',
                    contentUrl: '',
                    thumbnailUrl: ''
                  },
                  searchFunctionUrl: functionUrl,
                  selectedImage: this.properties.imageLocation,
                  previewImage: true,
                  disabled: false,
                  onPropertyChange: this.selectedImageChanged.bind(this),
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 500,
                  key: 'imagePickerFieldId',
                  images: []
                })
              ]
            }
          ]
        }
      ]
    };

      
  }
}



