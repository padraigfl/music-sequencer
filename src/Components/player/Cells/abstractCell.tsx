import * as React from 'react';
import styled from 'styled-components';
import playerContext from '../../../Core/context';
import { MULTI_TOUCH } from '../../../Core/_constants';
import { getTouchValues, getButtonData } from '../_utils';
import desktopEventsContext from '../DesktopEventsContext';

const buttonLight = (color) => (
  `background: ${color};
  box-shadow: 0px 0px 9px ${color};`
)
const active = buttonLight('radial-gradient(#efaaaa 40%, #e8e8e8 75%)');
const temp = buttonLight('#9999d0');
const highlight = buttonLight('#ffd0d0');

const DefaultCell: React.FC<any> = styled('button')`
  @keyframes flash {
    0% { box-shadow: initial; }
    20% { box-shadow: 0px 0px 50px red; }
    70% { box-shadow: intiial; }
  }
  background-color: #e8e8e8;  
  margin: 5px;
  word-wrap: break-word;
  padding: 0px;

  ${({ height }) => height ? `grid-row: span ${height};` : ''}
  ${({ width  }) => width ? `grid-column: span ${width};` : ''}
  &[data-live] {
    ${highlight}
  }
  &[data-active]:not(:active) {
    ${active}
  }
  &:focus {
    outline: none;
  }
  &:active, &[data-active] {
    ${active}
  }
  &[data-held] {
    ${temp}
  }
  &[data-held][data-active] {
    background-color: #aae0aa;
    box-shadow: 0px 0px 9px #9999d0, inset 0px 0px 4px 4px #9999d0;
  }
  .pad & {
    &[data-active], &:focus {
      border: none;
      padding-top: 2px;
      padding-left: 2px;
      background-color: #eeeeee;
      box-shadow: 0px 0px 2px white;
    }
  }
  &::after {
    display: inline-block;
    content: attr(data-display);  background-repeat: no-repeat;
    background-size: 24px;
    background-position: center;
    ${({ icon }) => icon  ? `background-image: url(${icon}); content: ''; width: 100%; height: 100%;` : ''}
    ${({ isDataDisplay }) => isDataDisplay
      ? `font-family: monospace; font-size: 8px; line-height: 16px;`
      : ''
    }
  }
  &:active::after {
    transform: translate(1px, 1px);
  }

`;

const holdTime = 400;

type GenericEventFunction = (e: Event) => any;

interface CellProps {
  value?: string | number;
  id?: string;
  action: string;
  secondaryAction?: string;
  onHold?: Function;
  onRelease?: Function;
  onClick: Function;
  onMouseEnter?: GenericEventFunction;
  onMouseLeave?: GenericEventFunction;
  noTouch?: boolean;
  Component?: any;
  icon?: string;
  isActive?: boolean;
  display?: string;
  highlight?: boolean;
  isDataDisplay?: boolean;
  buttonId?: string;
  idx?: number;
  ref?: any; // TODO: resolve
  height?: number;
  width?: number;
}

/**
 * As desktop cannot do multitouch, a secondary system involving holding down buttons is required too
 */
const Cell: React.FC<CellProps> = React.forwardRef((props, ref) => {
  const holdTimer = React.useRef(null);
  const { dispatch } = React.useContext(playerContext);
  const desktop: any = React.useContext(desktopEventsContext);
  const isHeld = React.useMemo(() => {
    const checkValue = typeof props.value !== 'undefined'
      ? props.value
      : (props.id || undefined)
    return (
      props.secondaryAction
      && desktop.held
      && (desktop.held.secondary === props.secondaryAction)
      && (desktop.held.value === checkValue)
      ? true
      : undefined
    )
  }, [desktop.held, props.secondaryAction, props.value]);

  const onMouseDown = React.useCallback((e) => {
    const buttonData = getButtonData(e.target);
    holdTimer.current = setTimeout(() => {
      if (holdTimer.current && props.secondaryAction) {
        desktop.onHold(buttonData);
      }
      holdTimer.current = null;
    }, holdTime);
  }, []);

  const onMouseUp = React.useCallback(() => {
    if (holdTimer.current && !props.onClick) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const onClick = React.useCallback((e) => {
    const buttonData = getButtonData(e.target);
    if (
      desktop.held.secondary
      && (
        holdTimer.current
        || (desktop.held.secondary !== buttonData.secondary)
      )
    ) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      desktop.holdAction(buttonData);
    } else if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      if (props.onClick) {
        props.onClick(e);
      }
      return;
    } else if (props.onHold && props.onClick) {
      props.onClick(e);
    }
  }, [props.onClick, desktop.held]);

  const onTouchStart = React.useCallback((e) => {
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
    }, holdTime);
    if (isHeld) {
      return;
    } else {
      console.log(getTouchValues(e));
      dispatch({
        type: MULTI_TOUCH,
        value: getTouchValues(e),
      });
    }
  }, [desktop.held, isHeld]);

  const actionProps = React.useMemo(() => {
    return {
      onClick,
      onMouseDown: props.onHold || onMouseDown,
      onMouseUp: props.onRelease || onMouseUp,
      onTouchStart: props.noTouch ? undefined : (props.onHold || onTouchStart),
      onTouchEnd: props.noTouch ? undefined : (props.onRelease || onMouseUp),
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
    }
  }, [
    props.onClick,
    props.onMouseEnter,
    props.onMouseLeave,
    desktop.held,
  ]);

  return (
    <props.Component
      type="button"
      { ... actionProps }
      data-secondary={props.secondaryAction}
      data-display={props.icon ? undefined : props.display }
      data-value={
        typeof props.value !== 'undefined'
          ? props.value
          : props.id
      }
      data-action={props.action}
      data-active={props.isActive ? true : undefined}
      data-held={isHeld}
      data-idx={props.idx}
      data-live={props.highlight || undefined}
      ref={ref}
      id={props.buttonId}
      height={props.height}
      width={props.width}
      icon={props.icon}
      isDataDisplay={props.isDataDisplay && typeof props.display !== 'undefined'}
    >
      { props.children }
    </props.Component>
  )
});

Cell.defaultProps = {
  Component: DefaultCell,
}

export default Cell;
