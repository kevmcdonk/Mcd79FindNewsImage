import * as React from 'react';
import styles from './FindANewsImage.module.scss';
import { IFindANewsImageProps } from './IFindANewsImageProps';

export default class FindANewsImage extends React.Component<IFindANewsImageProps, void> {
  public render(): React.ReactElement<IFindANewsImageProps> {

    console.log('Rendering tsx');
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div>
            <img data-sp-prop-name="imageSource" src={this.props.imageLocation.contentUrl} width="100%" />
          </div>
        </div>
      </div>
    );
  }
}
