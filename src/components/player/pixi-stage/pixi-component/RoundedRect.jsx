import { Graphics } from 'pixi.js';
import { PixiComponent } from '@inlet/react-pixi';

import * as PIXI from 'pixi.js';
import ee from '../../../../utilities/event-emitter';
import Slider from '../../../../utilities/iwm/Slider';
import GrayColor from '../../../../enities/Color/GrayColor';
import EventEnum from '../../../../enities/Event/EventEnum';
import PIXISceneChangeEvent from '../../../../enities/Event/PIXISceneChangeEvent';

export default PixiComponent('RoundedRect', {
  create: props => {
    return new Graphics()
  },
  didMount: (instance, parent) => {
    // apply custom logic on mount
  },
  willUnmount: (instance, parent) => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    const { scene, type, fill, x, y, width, height, round, lineColor, lineWidth, lineAlpha, interactive } = newProps
    instance.clear()
    instance.lineStyle(lineWidth, lineColor, lineAlpha)
    instance.beginFill(fill)
    instance.drawRoundedRect(0, 0, width, height, round)
    instance.endFill();
    instance.position.set(x, y);

    instance.type = type;
    instance.scene = scene;

    if (interactive) {
      instance.interactive = true;
      instance.buttonMode = true;
      if (instance.type == 0) {
        instance.pointerdown = () => {
          ee.emit(EventEnum.PIXISceneChangeEvent, new PIXISceneChangeEvent(Date.now(), this, scene));
        }

        instance.pointerover = () => {
          instance.clear();
          instance.beginFill(0xffffff, 1)
            .lineStyle(6, 0xdc3c05, 1)
            .drawRoundedRect(0, 0, 465, 120, 20)
            .endFill();
          instance.position.set(x, y);

          instance.children[0].style.fill = 0xdc3c05;
        }

        instance.pointerout = () => {
          instance.clear();
          instance.beginFill(0xdc3c05, 1)
            .drawRoundedRect(0, 0, 465, 120, 20)
            .endFill();
          instance.position.set(x, y);

          instance.children[0].style.fill = 0x0;
        }
      }

    }
  },
})
