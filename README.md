Remote-Controlled bowling

https://orzechowskikamil.github.io/rc-bowling/


Actually, this project is *abadoned*, because *you cannot calculate position in time from noisy acceleration values, error is horrible*.
And without "throwing ball by throwing mobile phone" this game would be identical to rest of games of this type.

Goal was to learn WebGL and something about physics in games.
I wanted to create a bowling game in browser, which will be not only controlled by mouse, but also by *paired mobile device movement*.
It selling point would be very natural feeling process of throwing bowling ball into track, by just holding phone in hand.

So graphics in the game and scenes are as basic as possible. Physics engine comes from babylon.js library. Knocked pins are calculated as those which Y coord is under the floor.
