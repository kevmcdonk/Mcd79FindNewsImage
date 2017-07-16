import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
  IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import PropertyFieldImagePickerHost, { IPropertyFieldImagePickerHostProps } from './PropertyFieldImagePickerHost';
import { IWebPartContext } from '@microsoft/sp-webpart-base';

export interface IImage {
    imageId: string,
    thumbnailUrl: string,
    name: string,
    contentUrl: string
}

export interface IPropertyFieldImagePickerProps {

  label: string;
  initialValue?: IImage;
  searchFunctionUrl: string;
  selectedImage: IImage;
  context: IWebPartContext;
  previewImage?: boolean;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  render(): void;
  disableReactivePropertyChanges?: boolean;
  properties: any;
  key?: string;
  disabled?: boolean;
   onGetErrorMessage?: (value: string) => string | Promise<string>;
   deferredValidationTime?: number;
   images: any;
}

export interface IPropertyFieldImagePickerPropsInternal extends IPropertyPaneCustomFieldProps {
  label: string;
  initialValue?: IImage;
  searchFunctionUrl: string;
  selectedImage: IImage;
  targetProperty: string;
  context: IWebPartContext;
  onRender(elem: HTMLElement): void;
  onDispose(elem: HTMLElement): void;
  onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
  render(): void;
  disableReactivePropertyChanges?: boolean;
  properties: any;
  disabled?: boolean;
  onGetErrorMessage?: (value: string) => string | Promise<string>;
  deferredValidationTime?: number;
  previewImage?: boolean;
  readOnly?: boolean;
  allowedFileExtensions?: string;
  images: any;
}

class PropertyFieldImagePickerBuilder implements IPropertyPaneField<IPropertyFieldImagePickerPropsInternal> {

  //Properties defined by IPropertyPaneField
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyFieldImagePickerPropsInternal;

  //Custom properties
  private label: string;
  private initialValue: IImage;
  private searchFunctionUrl: string;
  private selectedImage: IImage;
  private context: IWebPartContext;
  private onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;
  private customProperties: any;
  private key: string;
  private disabled: boolean = false;
  private onGetErrorMessage: (value: string) => string | Promise<string>;
  private deferredValidationTime: number = 200;
  private previewImage: boolean = true;
  private readOnly: boolean = true;
  private allowedFileExtensions: string = ".gif,.jpg,.jpeg,.bmp,.dib,.tif,.tiff,.ico,.png";
  private renderWebPart: () => void;
  private disableReactivePropertyChanges: boolean = false;
  private images: any = [];

  /**
   * @function
   * Ctor
   */
  public constructor(_targetProperty: string, _properties: IPropertyFieldImagePickerPropsInternal) {
    this.render = this.render.bind(this);
    this.targetProperty = _properties.targetProperty;
    this.properties = _properties;
    this.label = _properties.label;
    this.initialValue = _properties.initialValue;
    this.context = _properties.context;
    this.properties.onDispose = this.dispose;
    this.properties.onRender = this.render;
    this.onPropertyChange = _properties.onPropertyChange;
    this.customProperties = _properties.properties;
    this.images = _properties.images;
    this.key = _properties.key;
    if (_properties.disabled === true)
      this.disabled = _properties.disabled;
    this.onGetErrorMessage = _properties.onGetErrorMessage;
    if (_properties.deferredValidationTime !== undefined)
      this.deferredValidationTime = _properties.deferredValidationTime;
    if (_properties.previewImage != null && _properties.previewImage != undefined)
      this.previewImage = _properties.previewImage;
    if (_properties.readOnly === false)
      this.readOnly = _properties.readOnly;
    if (_properties.allowedFileExtensions != null && _properties.allowedFileExtensions !== undefined && _properties.allowedFileExtensions != '')
      this.allowedFileExtensions = _properties.allowedFileExtensions;
    this.renderWebPart = _properties.render;
    if (_properties.disableReactivePropertyChanges !== undefined && _properties.disableReactivePropertyChanges != null)
      this.disableReactivePropertyChanges = _properties.disableReactivePropertyChanges;
  }

  /**
   * @function
   * Renders the ColorPicker field content
   */
  private render(elem: HTMLElement): void {
    //Construct the JSX properties
    const element: React.ReactElement<IPropertyFieldImagePickerHostProps> = React.createElement(PropertyFieldImagePickerHost, {
      label: this.label,
      initialValue: this.initialValue,
      searchFunctionUrl: this.properties.searchFunctionUrl,
      selectedImage: this.selectedImage,
      context: this.context,
      targetProperty: this.targetProperty,
      onDispose: this.dispose,
      onRender: this.render,
      onPropertyChange: this.onPropertyChange,
      properties: this.customProperties,
      key: this.key,
      disabled: this.disabled,
      onGetErrorMessage: this.onGetErrorMessage,
      deferredValidationTime: this.deferredValidationTime,
      previewImage: this.previewImage,
      render: this.renderWebPart,
      disableReactivePropertyChanges: this.disableReactivePropertyChanges,
      images: this.images
    });
    //Calls the REACT content generator
    ReactDom.render(element, elem);
  }

  /**
   * @function
   * Disposes the current object
   */
  private dispose(elem: HTMLElement): void {

  }

}

/**
 * @function
 * Helper method to create a Picture Picker on the PropertyPane.
 * @param targetProperty - Target property the Picture picker is associated to.
 * @param properties - Strongly typed Picture Picker properties.
 */
export function PropertyFieldImagePicker(targetProperty: string, properties: IPropertyFieldImagePickerProps): IPropertyPaneField<IPropertyFieldImagePickerPropsInternal> {

    //Create an internal properties object from the given properties
    var newProperties: IPropertyFieldImagePickerPropsInternal = {
      label: properties.label,
      targetProperty: targetProperty,
      initialValue: properties.initialValue,
      searchFunctionUrl: properties.searchFunctionUrl,
      onPropertyChange: properties.onPropertyChange,
      properties: properties.properties,
      context: properties.context,
      onDispose: null,
      onRender: null,
      key: properties.key,
      disabled: properties.disabled,
      onGetErrorMessage: properties.onGetErrorMessage,
      deferredValidationTime: properties.deferredValidationTime,
      previewImage: properties.previewImage,
      render: properties.render,
      disableReactivePropertyChanges: properties.disableReactivePropertyChanges,
      images: properties.images,
      selectedImage: properties.selectedImage
    };
    //Calls the PropertyFieldPicturePicker builder object
    //This object will simulate a PropertyFieldCustom to manage his rendering process
    return new PropertyFieldImagePickerBuilder(targetProperty, newProperties);
}

