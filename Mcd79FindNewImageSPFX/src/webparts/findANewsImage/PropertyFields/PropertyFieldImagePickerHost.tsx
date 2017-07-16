import * as React from 'react';
import { IPropertyFieldImagePickerPropsInternal, IImage } from './PropertyFieldImagePicker';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Button, DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Async } from 'office-ui-fabric-react/lib/Utilities';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import * as styles from '../components/FindANewsImage.module.scss';
import * as $ from 'jQuery';


export interface IPropertyFieldImagePickerHostProps extends IPropertyFieldImagePickerPropsInternal {
}

export interface IPropertyFieldImagePickerHostState {
  openPanel?: boolean;
  openRecent?: boolean;
  openSite?: boolean;
  openUpload?: boolean;
  recentImages?: string[];
  selectedImage: IImage;
  errorMessage?: string;
  images: IImage[]
}

const ROWS_PER_PAGE = 3;
const MAX_ROW_HEIGHT = 250;

export default class PropertyFieldImagePickerHost extends React.Component<IPropertyFieldImagePickerHostProps, IPropertyFieldImagePickerHostState> {

  private async: Async;
  private delayedImageSearch: (value: string) => void;
  
  private _positions;
  private _columnCount: number;
  private _columnWidth: number;
  private _rowHeight: number

  constructor(props: IPropertyFieldImagePickerHostProps) {
    super(props);
    //Bind the current object to the external called onSelectDate method
    this.onTextFieldChanged = this.onTextFieldChanged.bind(this);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this._positions = {};
    this._getItemCountForPage = this._getItemCountForPage.bind(this);
    this._getPageHeight = this._getPageHeight.bind(this);
    this.performSearch = this.performSearch.bind(this);
    

    //Inits the state
    this.state = {
      selectedImage: {imageId:'-1', thumbnailUrl:this.props.initialValue.thumbnailUrl, name: 'Initial', contentUrl: this.props.initialValue.contentUrl},
      openPanel: false,
      openRecent: false,
      openSite: true,
      openUpload: false,
      recentImages: [],
      errorMessage: '',
      images:  []
    };

    this.async = new Async(this);
    this.delayedImageSearch = this.async.debounce(this.performSearch, this.props.deferredValidationTime);
  }

  private onOpenPanel(element?: any): void {
    this.setState({
        openPanel: true
    } as IPropertyFieldImagePickerHostState);
  }

  private onTextFieldChanged(element?: any): void {
    //this.delayedImageSearch();
  }

  private performSearch(value: string): void {
    let functionUrl = this.props.searchFunctionUrl;
      //console.log('Perform search:' + value);
      var timeoutSelf = this;
    setTimeout(function(){
        console.log('timeout set: ' + value);
        var self = timeoutSelf;
        $.ajax({
            url: timeoutSelf.props.searchFunctionUrl + "&query=" +  value,
            method: "GET"
        }).done(function (data) {
            var response = JSON.parse(data);
            console.log(response.value);
            self.props.initialValue.contentUrl = response.value[0].contentUrl;


            var oldValue 
            if (self.state && self.state.selectedImage) {
                oldValue = self.state.selectedImage;
            }
            
            self.setState({
                images: response.value,
                selectedImage: response.value[0] //default to selected image being the first
            } as IPropertyFieldImagePickerHostState);
            self.props.properties[self.props.targetProperty] = response.value[0];
            self.props.onPropertyChange(self.props.targetProperty, oldValue, response.value[0]);
            if (!self.props.disableReactivePropertyChanges && self.props.render != null)
                self.props.render();
                });

        return '';
      }, 1500);
  }

  private onClosePanel(element?: any): void {
    this.setState({
        openPanel: false
    } as IPropertyFieldImagePickerHostState);
  }

   private onClickImage(item: IImage): void {
    //this.state.selectedImage = '';
    console.log(item);
    var oldValue = this.state.selectedImage;

    this.setState({
            selectedImage: item,
            openPanel: false
        } as IPropertyFieldImagePickerHostState);
    this.props.properties[this.props.targetProperty] = item;
    this.props.onPropertyChange(this.props.targetProperty, oldValue, item);
    if (!this.props.disableReactivePropertyChanges && this.props.render != null)
        this.props.render();
  }

  private onClickRecent(element?: any): void {
  }

  public componentDidMount() {
    //window.addEventListener('message', this.handleIframeData, false);
  }

  public componentWillUnmount() {
    //window.removeEventListener('message', this.handleIframeData, false);
    this.async.dispose();
  }

  private onSearchTextChange(element?: any): void {
      this.setState({
            openRecent: false,
            openSite: true,
            openUpload: false
        } as IPropertyFieldImagePickerHostState);
  }

  private onClickUpload(element?: any): void {
    this.setState({
            openRecent: false,
            openSite: false,
            openUpload: true
        } as IPropertyFieldImagePickerHostState);
  }

  private _getItemCountForPage(itemIndex: number, surfaceRect) {
    if (itemIndex === 0) {
      this._columnCount = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      this._columnWidth = Math.floor(surfaceRect.width / this._columnCount);
      this._rowHeight = this._columnWidth;
    }

    return this._columnCount * ROWS_PER_PAGE;
  }

  private _getPageHeight(itemIndex: number, surfaceRect) {
    return this._rowHeight * ROWS_PER_PAGE;
  }

  public render(): JSX.Element {

if (this.props.initialValue.contentUrl == '') {
        var pageName = 'News';
        if ($('textarea[placeholder="Name your page"').length > 0) {
            pageName = $('textarea[placeholder="Name your page"')[0].value;
        }
         
        if ($('div[data-automation-id="pageHeader"] div div div div span').length > 0) {
            pageName = $('div[data-automation-id="pageHeader"] div div div div span')[0].innerText;
        }

        if ((typeof(pageName) != 'undefined')) {
            this.delayedImageSearch(pageName);
        }
    }
    //Renders content
    return (
      <div style={{ marginBottom: '8px'}}>
        <Label>Search for image</Label>
         <DefaultButton disabled={this.props.disabled} onClick={this.onOpenPanel}>Search</DefaultButton>

        { this.state.errorMessage != null && this.state.errorMessage != '' && this.state.errorMessage != undefined ?
              <div><div aria-live='assertive' className='ms-u-screenReaderOnly' data-automation-id='error-message'>{  this.state.errorMessage }</div>
              <span>
                <p className='ms-TextField-errorMessage ms-u-slideDownIn20'>{ this.state.errorMessage }</p>
              </span>
              </div>
            : ''}

        {this.state.selectedImage != null && this.state.selectedImage.thumbnailUrl != '' && this.props.previewImage === true ?
        <div style={{marginTop: '7px'}}>
          <img src={this.state.selectedImage.thumbnailUrl} width="225px" height="225px" alt="Preview" />
        </div>
        : ''}

        { this.state.openPanel === true ?
        <Panel
          isOpen={this.state.openPanel} hasCloseButton={true} onDismiss={this.onClosePanel}
          isLightDismiss={true} type={PanelType.large}
          headerText='Pick image'>
          <Label>Search for images</Label>
          <SearchBox onChange={ this.delayedImageSearch}/>
         <FocusZone>
        <List
          className={styles.default.msListGridExample}
          items={ this.state.images }
          //getItemCountForPage={ this._getItemCountForPage }
          //getPageHeight={ this._getPageHeight }
          renderedWindowsAhead={ 4 }
          onRenderCell={ (item, index) => (
            <div
              className={styles.default.msListGridExampleTile}
              data-is-focusable={ true }
              onClick={this.onClickImage.bind(this, item)}
              style={ {
                width: (100 / this._columnCount) + '%'
              } }>
              <div className={styles.default.msListGridExampleSizer}>
                <div className={styles.default.msListGridExamplePadder}>
                  <img src={ item.thumbnailUrl } className={styles.default.msListGridExampleImage} />
                  <span className={styles.default.msListGridExamplelabel}>
                    { item.name }
                  </span>
                </div>
              </div>
            </div>
          ) }
        />
      </FocusZone>

        </Panel>
        : '' }

      </div>
    );
  }

}