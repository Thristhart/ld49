=== beholderAttack ===
Cassie scampers back to Wilfred's perch.
crow: Is that a hat?
cat: Yup! It makes me MAGICAL. Check this out!
Cassie casts Ice Knife all around, showing the nearby trees and rocks that she's the boss.
crow: Careful, that seems dangerous! And quite noisy. Where did you find that hat?
cat: Wouldn't you like to know!
#speaking:
The commotion is interrupted by the rustling of bushes and a groan.
#speaking:cat,beholder
beholder: I see... the hat...
cat: Aaah! What are you?!
beholder: I... see you...
#speaking:crow,beholder
crow: Stay back! Cassie, defend yourself!
#speaking:cat,beholder
~ combat = "beholderAttack"
cat: Aaah!
~ shouldShowDialog = false
crow: Are you okay, Cassie? It looked like those things hurt you pretty badly!
cat: I'm okay, I think! Why did those things go after me?
crow: I have a suspicion. Allow me to confirm it...
Wilfred swoops down to inspect the mess that the beholders left behind.
crow: Aha, I thought as much. And what's this?
~ crowHasKnife = true
crow: A knife?
crow: There are clear signs of the work of the wizard Batulathil here.
crow: This knife feels like a magical implement, and I suspect your hat is as well.
- (convo)
* [Knife] cat: Your knife lets you do magic too?
    crow: Yes, it seems so. Given the general aesthetic, I suppose it will be some sort of Blood Magic.
    -> convo
* [Batulathil] cat: Who's Batulathil?
    crow: I know only stories. He's supposed to be a powerful wizard, who corrupts animals into twisted creatures to serve his dark purposes.
    -> convo
* ->
- crow: These must be Batulathil's implements. Why are they here?
- cat: He must have lost them! If he wants this hat back, he can't have it!
- cat: Finders keepers!
- crow: Mmmm, yes. Finders keepers indeed. If Batulathil is truly lacking his implements, this is a rare opportunity.
- crow: We may be able to rid the world of a great evil. Now, young Cassie—
- cat: Sounds good, I'm in!
- crow: What, just like that? I thought I would need to convince you.
- cat: Naw, if Batulathil is evil and this is the chance we need? Sounds like an adventure! Let's do it!
#speaking:
Cassie and Wilfred set off into the woods on a grand adventure.
Before long, they stumble upon a couple creatures, who don't seem to have noticed them.
crow: Careful, Cassie. These are certainly Batulathil's creatures.
cat: Then let's get 'em!
~ combat = "creatures"
#speaking:crow
crow: Wait, hold on—
crow: Well, I guess we're fighting now!
~ shouldShowDialog = false
#bg:nightforest
Night falls, and the pair find a clearing to rest in.
cat: I'm just saying, if you were less grumpy all the time, I'm sure you'd have more bird friends!
crow: I'm not grumpy! And I have plenty of friends!
cat: See, you're so contradictory!
fox: And you're always yelling at this poor cat!
cat: Yeah, exactly! Wait, what?
#speaking:crow,fox
crow: Identify yourself immediately!
fox: A pleasure to meet you. You may call me Pierre. I saw what you did to those creatures. Impressive work.
crow: I can't help but notice you watched and didn't help.
fox: You had it squarely in hand! I also wanted to be sure you were not in league with that vile wizard.
crow: Batulathil? You know about him?
fox: Indeed! I stole this flashy hat from him.
Pierre whips his head from side to side showing off his hat and feather.
crow: I imagine it lets you use some kind of power?
fox: Quite correct. If you come with me I can show you my magic and we can take the fight to Batulathil himself!
#speaking:cat,fox
cat: Let's go kick some magical butt!
fox: Follow me. I know the way to one of his lieutenants who surely will know where the sorcerer is hiding.
#speaking:
The trio dissapear into the distance.
#bg:cave
#speaking:cat
cat: It's getting kinda dark in here...are you sure this is the right place?
#speaking:cat,crow
crow: Maybe she's out prowling. Looking for little cats who ask too many questions.
Cassie paws at her hat.
cat: Don't forget—
#speaking:fox
fox: Shhh! Did you hear that?
The sound of metal scraping on stone echoes through the cave.
#speaking:fox,dog
dog: C'mon you woke me from my damn slumber. Who's that rumbling around in Maxine's cave?
Pierre takes his hat of and bows to the huge dog.
fox: Maxine! It's lovely to see you again. My friends and I were hoping you would be so kind as to show us the way to your master.
dog: You?! How'd you think this was gonna go?
dog: They're the ones the boss wants! Get 'em boys!
~ combat = "dogFight"
~ shouldShowDialog = false
#speaking:cat,dog
dog: Ok, fine, I get it. Y'all are powerful and wanna kill me. Go ahead, just make it quick if you don't mind.
cat: That's not what we want!
#speaking:fox,dog
fox: Maxine, we are here to ask you for assistance.
dog: Huh? Don't be tellin' no tall tales on me. Batulathil wants his stuff back and you won't give him the stuff, so we're enemies. That's simple math.
fox: Have you ever considered that you don't have to work for that fiend?
dog: But...he gave me this here weapon...
#speaking:crow,dog
crow: Yes, but he also has turned some of your friends into mindless monstrosities and ordered you to do some nasty work.
dog: It sure was tough seein' my partners turn into those things.
dog: You're saying I can just ignore him?
#speaking:cat,dog
cat: Better yet.
cat: You can get even.
#speaking:
Thanks for playing! This is where the game ends right now, but who knows what will come in the future?

-> END