# About

Spring motion.



## Examples

- [spring](../../ex/spring/)



## Usage

```js
import { Spring } from 'omega/dist/Spring.js'
```



## Docs

`Spring`

```js
const spring = new Spring({
  from: new Vector3(0, 1, 0), // pull coords
  to: new Vector3(0, 2, 0),   // equilibrium coords
  frequency: 5,               // 0=stay
  decay: 0.5,                 // 0=instant, 1=forever
  maxAmplitude: Infinity      // |from-to| < maxAmplitude 
  position: mesh.position     // write current position into
});

spring.from
spring.to
spring.frequency
spring.decay
spring.maxAmplitude
spring.position
spring.isIdle      // readonly
spring.reset()     // reset motion
spring.update(dt)  // advance (dt in sec)
```