import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import * as strings from 'findANewsImageStrings';
import FindANewsImage from './components/FindANewsImage';
import { IFindANewsImageProps } from './components/IFindANewsImageProps';
import { IFindANewsImageWebPartProps } from './IFindANewsImageWebPartProps';
import * as $ from 'jQuery';  

export default class FindANewsImageWebPart extends BaseClientSideWebPart<IFindANewsImageWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFindANewsImageProps > = React.createElement(
      FindANewsImage,
      {
        imageSearchText: this.properties.imageSearchText,
        imageExternalLocation: this.properties.imageExternalLocation,
        imageLocation: this.properties.imageLocation,
        functionUrl: this.properties.functionUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private performImageSearch(value: string): string {
    if (value === null ||
      value.trim().length === 0) {
      return 'Please provide some image text';
      //TODO: If no text, use page title
    }

    if (value.length < 5) {
      return 'Image text should be more than 5';
    }

    var self = this;
    $.ajax({
          url: this.properties.functionUrl + "&query=" +  value,
          method: "GET"
      }).done(function (data) {
        var response = JSON.parse(data);

        self.properties.imageExternalLocation=  response.value[0].contentUrl;
         self.context.propertyPane.refresh();
      });

    return '';
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
                 PropertyPaneTextField('functionUrl', {
                  label: strings.FunctionUrlLabel
                }),
                PropertyPaneTextField('imageSearchText', {
                  label: strings.ImageSearchTextLabel,
                  onGetErrorMessage: this.performImageSearch.bind(this)
                }),
                PropertyPaneTextField('imageExternalLocation', {
                  label: strings.ImageExternalLocationLabel
                }),
                PropertyPaneTextField('imageLocation', {
                  label: strings.ImageLocationLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
