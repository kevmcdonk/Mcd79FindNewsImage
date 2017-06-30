import * as React from 'react';
import styles from './FindANewsImage.module.scss';
import { IFindANewsImageProps } from './IFindANewsImageProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class FindANewsImage extends React.Component<IFindANewsImageProps, void> {
  public render(): React.ReactElement<IFindANewsImageProps> {
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div>
            <p className="ms-font-l ms-fontColor-white">{escape(this.props.imageSearchText)}</p>
            <img src={this.props.imageExternalLocation} width="100%" />
          </div>
        </div>
      </div>
    );
  }
}
