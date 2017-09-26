# Hello!

I created arcade game inspiried by Space Invaders game by Taito Corporation 1978. In this project i was training object oriented programing in JavaScript and I wanted to learn more about JS. First I was learning much about a prototypes and object creations than i have learnt how to do this use ECMAScript 6. The most problems have caused the system of movement Enemy Army. How do this motion: left * n and when some enemy ship will be nearby left edge the board, all alive enemy ships slide down and will be moving to right. I wanted to this system as well as I can. I have resolved this problem that: I created ten vertical row which contains a enemy ships in vertical than if enemy army is moving to left I start check vertical rows with a enemy ships but I start with the first vertical row exactly this which is the closest left edge of the board and if is some alive ship in row, variable "position" is overwrite and riht now contains left space this ship from the left edge. If position variable will be smaller than X all enemy ships will be slide down and direction of movement will be opposite. This solution provide low use of memory and faster action.

The game was create with RWD tehnique and you can play on large screen, medium screen and tablet! I used HTML5, CSS3 with Sass preprocessor and BEM methodology, JavaScript (ES6) and jQuery library. 

In the next project similar to this I will throw out jQuery library and I will use instead this canvas.

You can play this game here: http://poyters.pl/spaceinvaders
