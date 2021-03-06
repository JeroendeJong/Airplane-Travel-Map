import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import Icon from '../../../../common/evil-icon';
import { StyledHover } from '../../../../styled-utils';
import { readableTravelColor } from '../../../misc/common';

const Container = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;

  margin-left: 10px;

  font-size: 12px;
  font-weight: lighter;

  width: 99%;
  border-left: 2px solid lightgray;

  color: ${p => readableTravelColor(p.theme.color.secondary)};

  :first-child {
    margin-top: 50px;
  }

  :not(:first-child) {
    margin-top: 10px;
  }

  :last-child {
    margin-bottom: 10px;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${StyledHover`
    cursor: pointer;
  `}
`;

const MainContent = styled.div`
  width: 100%;
`;

const TimelineBody = (props: any) => {
  return (
    <Container data-id={props.id} onClick={props.onClick}>
      <MainContent>
        {props.children}  
      </MainContent>
      <Icon id={'ei-chevron-right-icon'}/>
    </Container>
  );
}

export default TimelineBody;