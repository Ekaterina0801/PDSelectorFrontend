import React from 'react';
import base from '../BaseCard.module.scss';
import styles from './TeamCard.module.scss';
import MainContent from '../../main-section/MainSection';
import trackStore from '../../../stores/trackStore';
import { observer } from 'mobx-react';
import {useState, useEffect} from 'react';

export default observer(function TeamCard({
  name,
  projectType,
  description,
  technologies = [],
  profileLink,
  viewText = 'Перейти',
  trackId,
  quantityOfStudents
}){ 

  const [trackInfo, setTrackInfo] = useState("");
  const [statusQuantity, setStatusQuantity] = useState("full");

  useEffect(() => {
    trackStore.getTrackById(trackId).then((result) => setTrackInfo (result))
  }, [trackId]);

  useEffect(() => {
    if (trackInfo.maxConstraint == quantityOfStudents) {
      setStatusQuantity("full");
    }
    else {
      setStatusQuantity("notFull");
    }
  }, [trackInfo]);
  
  {
    return (
      <div className={base.card}>
        <div className={base['card-header']}>
          <h3 className={base['card-name']}>{name}</h3>
          {projectType && (
            <p className={base['card-type']}>Тип: {projectType}</p>
          )}
        </div>

        <div className={base['card-body']}>
          {description && (
            <p className={base['card-resume']}>{description}</p>
          )}
          <div className={base['card-tags']}>
            {technologies.length
              ? technologies.map(t => (
                  <span key={t.id} className={base['card-tag']}>
                    {t.name}
                  </span>
                ))
              : <span className={base.noTags}>-</span>}
          </div>
        </div>
        <div className={`${base['quantity-of-students']} ${base[statusQuantity]}`}>
          <span>Занято мест: {quantityOfStudents} из {trackInfo.maxConstraint}</span>
        </div>
        <div className={base['card-actions']}>
          <a href={profileLink} className={base['action-link']}>
            <button className={base['action-button']}>{viewText}</button>
          </a>
        </div>
      </div>
    )
  }

});