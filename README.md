## Mila Turtle 1.0

![Mila Turtle 1.0 Logo](./images/logo.jpeg)

This is a simple fun little Logo program written in React that compiles instructions to the little turtle on the screen so it can draw beautiful colorful shapes.

This is a great learning tool for young children to start getting into computer programing.

![Mila Turtle 1.0](./images/mila_turtle.png)

## Install

After cloning the repo run the following commands

#### With npm

```js
npm install
npm start
```

#### With Yarn

```
yarn
yarn start
```

## Local Development

The app has support for Hot Module Reload (HMR)

## Language

The language is really easy to learn! Here are the commands that are used to control the little turtle and make great sprites!

| Command  | Argument                                                      | Description                                                                                                  | Example                 |
| -------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `RIGHT`  | `number` or `<variable name>`                                 | Rotate the turtle to the right by a number of degress                                                        | `RIGHT 90` or `RIGHT a` |
| `LEFT`   | `number` or `<variable name>`                                 | Rotate the turtle to the left by a number of degress                                                         | `LEFT 90` or `LEFT a`   |
| `MOVE`   | `number` or `<variable name>`                                 | Move the turtle ahead by a number of pixels                                                                  | `MOVE 100` or `MOVE a`  |
| `PEN`    | `'DOWN'\|'UP'`                                                | Put the pen either down to draw or up to stop drawing                                                        | `PEN DOWN`              |
| `DO`     | `number`                                                      | Begin a loop. Every instruction after a `DO` and before an `END` is looped for the specified number of times | `DO 20`                 |
| `END`    | `undefined`                                                   | Marks the end of the looped instruction set                                                                  | `END`                   |
| `CENTER` | `undefined`                                                   | Instructs the turtle to retrun to the center of the canvas in its current orientation                        | `CENTER`                |
| `DIR`    | `'NORTH'\|'SOUTH'\|'EAST'\|'WEST'`                            | Rotate the turtle to one of the 4 standard orientations                                                      | `DIR NORTH`             |
| `COLOR`  | `'WHITE'\|'RED'\|'GREEN'\|'BLUE'\|'PURPLE'\|'ORANGE'\|'PINK'` | Set the turtle color and color of any drawn lines that are made from that point                              | `COLOR BLUE`            |
| `STROKE` | `number`                                                      | Set the stroke width of the turtle's drawings                                                                | `STROKE 10`             |
| `#`      | `string`                                                      | Make non-executatble comments in your code                                                                   | `# this is a comment`   |
| `=`      | `number`                                                      | Assign a number to a variable                                                                                | `a=2`                   |
| `++`     | `undefined`                                                   | Increment a variable by 1 variable                                                                           | `a++`                   |

## Contributions

Would love some contributions to this!
