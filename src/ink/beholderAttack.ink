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
#bg:nightforest
Night falls, and the pair find a clearing to rest in.
cat: I'm just saying, if you were less grumpy all the time, I'm sure you'd have more bird friends!
crow: I'm not grumpy! And I have plenty of friends!
cat: See, you're so contradictory!
fox: And you're always yelling at this poor cat!
cat: Yeah, exactly! Wait, what?
#speaking:crow,fox
crow: Identify yourself immediately!
fox: A pleasure to meet you. You may call me Pierre. And I 



-> END