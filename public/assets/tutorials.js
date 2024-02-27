possible_tutorials = ['game_throne', 
                      'game_council_state',
                      'game_council_military',
                      'game_council_internal',
                      'game_council_science',
                      'game_council_spells',
                      'game_council_history',
                      'game_kingdom_details',
                      'game_kingdom_details_1_1',
                      'game_kingdom_intel_1_1',
                      'game_build', 
                      'game_explore', 
                      'game_science', 
                      'game_train_army', 
                      'game_vote',
                      'game_wizards',
                      'game_province_news',
                      'game_kingdom_news',
                      'kingdom_forum_topics',
                      'game_spells_reflexive',
                      'game_spells_combat',
                      'game_send_armies',
                      'game_aid',
                      'game_thievery',
                      'game_province_target_finder'];

// If tutorials enabled and current is not seen yet, auto-start
if (tutorial_enabled == 'True') {
    if (!seen_tutorials.includes(current_page))
    {
        if (possible_tutorials.includes(current_page)) {
            $(document).ready(function(){
                starttutorial(current_page);
            });
        }
    }
}
function starttutorial(page) {
        var intro = introJs();
        if (page == 'game_throne') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! This is the tutorial for your throne page which also highlights the main parts of the navigation system."
                  },
                  {
                    element: "#game-navigation",
                    intro: "Here is the navigation menu where you will navigate your Province to perform your tasks.",
                    position: 'right'
                  },
                  {
                    element: "#resource-bar",
                    intro: "Here you will find your current resources. Resources are important to keep track of so you can plan your future, but beware you don't want to run out of food!",
                    position: 'right'
                  },
                  {
                    element: '.current-date',
                    intro: "This is the current time for Utopia! Every real-life hour is an entire day in this world.  Which means there are 24 Utopian days (24 hours) in a Utopian month (1 real-life day) and 7 Utopian months (7 real-life days) in a Utopian year (1 real-life week).",
                    position: 'left'
                  },
                  {
                    element: ".two-column-stats",
                    intro: "These are the details of your Province where you see all essential values.  You will learn in time the meaning of all these values as we continue through the rest of the tutorial, but beware if your Peasants or Land ever reaches 0 your Province will crumble to ashes!",
                    position: 'right'
                  },
                  {
                    intro: "If you need help at any time, there are several resources available to you. You can speak with your Kingdom mates via the <b>chat window</b> in the bottom-right corner, or via the Mail and Forum options in your Navigation menu."
                  },
                  {
                    intro: "You can also check out the Utopia community <b>Forums</b>. The <b>Guide</b> provides a great starting point for new players. Once you are more comfortable with navigating the site, you can learn more about the numbers and formulas used by visiting the <b>Wiki</b>."
                  },
                  {
                    intro: "Now let's move on and learn to build your land by clicking on <b>Growth</b> in the Navigation menu."
                  },
                ]
              });
          } else if (page == 'game_council_state') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Welcome to your Affairs of the State page! You can learn valuable information regarding the prosperity and health of your Province from this page."
                  },
                  {
                    element: $("th:contains('Max Population')").next()[0],
                    intro: "Here is your Province Max Population.  This is the current maximum allowed capacity of your Province.  Be mindful of your Total Population in relation to your Max Population because this can affect certain functions that are allowed.  If your Total Population far exceeds your Max Population your peasants may begin to riot, refuse to perform Thievery operations, refuse to March out on attacks and begin deserting your lands!",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Daily Income')").next()[0],
                    intro: "This is the amount of gold coins our Province is projected to generate on the next tick.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('military Wages')").next()[0],
                    intro: "When you are adjusting your military wages to stop a net loss, these numbers are from the tick that just occurred ...",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Our Income')").next()[0],
                    intro: "This is the actual amount of gold coins that was generated on the previous tick.",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Food Grown')").next()[0],
                    intro: "Similar to the income, a steady loss of food can also cause issues. To remedy this, you can cast Fertile Lands, build more farms, assign scientists into Production, or steal some food, just don't run out!",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Runes Produced')").next()[0],
                    intro: "Runes are a very useful resource to have, but beware of hording them as it can make you a target for thieves and plunder attacks. A good rule of thumb is to ensure you have enough to keep up your self spells and then a buffer in case they fail. When going into a war, it may be useful to increase your towers so that you have spare Runes to cast Sorcery spells on our enemies!",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Current Honor')").next()[0],
                    intro: "Attacks, spells and thievery operations against targets can give you honor.  Likewise, while suffering attacks may cause you to lose honor. At certain honor levels, you will change ranks and receive bonuses.",
                    position: 'left'
                  },
                  {
                    intro: "You can learn more about the honor ranks and benefits from the <b>Wikipedia</b>, a link is available at the top of the page."
                  },
                ]
              });
          } else if (page == 'game_council_military') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "This is your military Advisor page! Detailed information about the strength of your army that is at home, status of your armies that are out attacking, as well as the troop training completion timetable can be seen here."
                  },
                  {
                    element: $("h2:contains('Wage Rate')").next()[0],
                    intro: "When you are adjusting your military wages, your base military effectiveness (ME) will slowly adjust with each tick.",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Offensive military Effectiveness')").next()[0],
                    intro: "Offensive military Effectiveness (OME) takes the base ME then adds other factors, such as unpaid wages, buildings (Training Grounds), scientists (military), spells, honor level, and personality to determine your final OME.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Defensive military Effectiveness')").next()[0],
                    intro: "Similarly, Defensive military Effectiveness (DME) takes the base ME then incorporates buildings (Forts), scientists (military), spells, and other factors to determine your final DME.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Net Offensive Points at Home')").next()[0],
                    intro: "While our throne page will show your offense and defense totals, the military Advisor will detail what the strength of your army at home is.",
                    position: 'right'
                  },
                  {
                    element: $("h2:contains('Army Availability')").next()[0],
                    intro: "You can view your marching military's return time here. If your army is returning in 3.75 days, that means it will return in 3 hours and 45 minutes.",
                    position: 'left'
                  },
                  {
                    intro: "You can learn more about the honor ranks and benefits from the <b>Wikipedia</b>, a link is available at the top of the page"
                  },
                ]
              });
          } else if (page == 'game_council_internal') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "This is your Buildings Advisor page! Detailed information about the allocation of your built acres and their respective benefits as well as the timetable for buildings under construction and acres being explored can be seen here."
                  },
                  {
                    element: ".two-column-stats",
                    intro: "The unfulfilled jobs (jobs minus workers) and your scientists (Tools) impact your Building Efficiency. Building Efficiency modifies the effects received from our buildings.",
                    position: 'left'
                  },
                  {
                    intro: "However, to maximize workers (peasants), your military capacity will suffer so it's a balancing act based on your own preferences."
                  },
                ]
              });
          } else if (page == 'game_council_science') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "This is your science Advisor page! This page displays the same information available from your regular science page so you won't need to visit this advisor often but we like to keep him around to make him feel important."
                  },
                  {
                    element: $("h2:contains('Current Effects of science')").next()[0],
                    intro: "This table will provide a summary for the overall effects of your scientists. Over time, your scientists will progress from Recruit to Novice to Graduate then to Professor and each promotion will increase the benefits you receive.",
                    position: 'right'
                  },
                ]
              });
          } else if (page == 'game_council_spells') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "This is your Mystics Advisor page! Here you can view the effects and duration of active spells affecting our lands, both positive and negative."
                  },
                  {
                    element: $("table:contains('Spell Name')").next()[0],
                    intro: "Spells with a green name help your province while those with a red name were cast on you by your enemies and will hurt you.",
                    position: 'left'
                  },
                  {
                    intro: "If you decide to endure the bad spells, you can use the information about their effects to decide what action you need to take to recover. For example, if you had Storms, you should cast Nature's Blessing to prevent having it cast again and Love and Peace to help offset the loss of peasants. For Droughts, cast Nature's Blessing and Fertile Lands."
                  },
                ]
              });
          } else if (page == 'game_council_history') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "This is your History page! Prepare to bask in the glory of your achievements so far this age. You can satisfy your curiosity by checking your stats on this page."
                  },
                  {
                    element: $("th:contains('Highest Honor')").next()[0],
                    intro: "Above here, you can see the highest you've reached for each category. Only you can see this page but you can use this to motivate yourself to do better and better.",
                    position: 'bottom'
                  },
                  {
                    element: $("th:contains('Average Relative Opponent Networth')").next()[0],
                    intro: "How's your track record for taking on targets your own size? This stat will let you know if you should up your game or if you are playing fair.",
                    position: 'bottom'
                  },
                  {
                    element: $("th:contains('Total Land Lost in Combat')").next()[0],
                    intro: "When you get knocked down, get back up again and throw some sand in their eyes. Wait, that's not the saying is it? Oh well, good advice though.",
                    position: 'bottom'
                  },
                  {
                    element: $("th:contains('Total Land Gained in Combat')").next()[0],
                    intro: "Oh look, here's the sand. Good job!",
                    position: 'top'
                  },
                  {
                    element: $("th:contains('Kingdom Growth')").next()[0],
                    intro: "Here will be 3 tables they'll show your kingdom's Networth, Land and Honor totals throughout the age. It's pretty interesting stuff to see as the age progresses!",
                    position: 'right'
                  },
                ]
              });
          } else if (page == 'game_kingdom_details') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "This is your Kingdom's page! You will visit this page quite a lot for various reasons."
                  },
                  {
                    element: $("tr:contains('Total Provinces')").next()[0],
                    intro: "When looking for a target, you'll want to check this area first so you have an idea how big your kingdom is. You don't want to hit a kingdom that is much larger than you, the retaliation could get ... messy ...",
                    position: 'top'
                  },
                  {
                    element: $("tr:contains('Stance')").next()[0],
                    intro: "Likewise over here, a province in the kingdom of a similar rank is an honorable target for us to consider.",
                    position: 'bottom'
                  },
                  {
                    element: $("table:contains('Slot')").next()[0],
                    intro: "Here is the current size for each member of your kingdom. You can organize this table by clicking on the headers.",
                    position: 'right'
                  },
                  {
                    element: $("table:contains('Slot')").next()[0],
                    intro: "You can check how your size is compared to those closest to you. If you have a 214 NWPA and someone else has 240 NWPA for around the same acreage, you can reach out to that person to ask for advise on how to pump up.",
                    position: 'right'
                  },
                  {
                    element: "#change-kingdom-nav",
                    intro: "You can visit the pages for other kingdoms by click on Previous, Random, Next, or by entering the kingdom number then pressing Go! To learn about a cool <b>espionage page</b>, visit the admin kingdom of 1:1 then click Tutorial again.",
                    position: 'top'
                  },
                ]
              });
          } else if (page == 'game_kingdom_details_1_1') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "This is the Utopian admin's Kingdom page. Unfortunately, they will never drop from protection so you can't attack them (sorry but not sorry). However, we have visited this page to look at a very useful feature, the Espionage page."
                  },
                  {
                    element: $("a href:contains('Espionage')").next()[0],
                    intro: "Click on this button then check out the tutorial for that page!",
                    position: 'right'
                  },
                ]
              });
          } else if (page == 'game_kingdom_intel_1_1') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Any intel gather by your kingdom are available on this page. Using the legend, you can see how old the information is. If it's green, you are typically good to go; however, red intel means you should probably get a refresh before taking action."
                  },
                  {
                    element: $("th:contains('Operations (Ticks remaining)')").next()[0],
                    intro: "Any offensive spells or thievery operations cast by your kingdom are available to view here. If someone has 'Greed (4)'' on them, it means their troop wages will by higher for the next 4 ticks so you don't need to refresh it yet. If someone has 'Meteor Showers (0)', then it can be refreshes as it won't cause any damage on the day change (tick).",
                    position: 'top'
                  },
                ]
              });
          } else if (page == 'game_build') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! This tutorial will walk us through the construction of our land into buildings."
                  },
                  {
                    element: $("th:contains('Total Undeveloped land')").next()[0],
                    intro: "This is how many acres that are available to build.",
                    position: 'left'
                  },
                  {
                    element: $("a href:contains('guide')").next()[0],
                    intro: "You can learn more about the benefits of each building from the Guide, Wikipedia and/or the Internal Affairs advisor page.",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Free Building Credits')").next()[0],
                    intro: "Here are your free credits. Each credit will allow you to build 1 acre of land at no gold cost.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Construction Time')").next()[0],
                    intro: "This is the amount of Utopian days (real-life hours) for a building to be completed.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Maximum Buildable Now')").next()[0],
                    intro: "This is how many acres you can afford to start construction on right now (includes using credits).",
                    position: 'left'
                  },
                  {
                    intro: "Now let's build up your land! If you have already gone through this set-up, you can click skip to move onto another tutorial."
                  },
                  {
                    element: $("#id_quantity_0")[0],
                    intro: "Homes increase your total population and increase birth rates. Let's build another 10% homes. Enter 40 in the field now then click next.",
                    position: 'right'
                  },
                  {
                    element: $("#id_quantity_5")[0],
                    intro: "Armories lower your training costs, military wages and draft costs. Let's assign 15% of our total land as armories. Enter 60 in the field now then click next.",
                    position: 'right'
                  },
                  {
                    element: $("#id_quantity_10")[0],
                    intro: "Guilds train wizards and affect the duration of your self-spells. Let's build another 10% guilds. Enter 40 in the field now then click next.",
                    position: 'right'
                  },
                  {
                    element: $("#id_quantity_11")[0],
                    intro: "Towers produce runes.  Runes are used by our wizards to cast spells. Let's build more Towers, enter 20 in this field now then click next.",
                    position: 'right'
                  },
                  {
                    element: $("#id_quantity_14")[0],
                    intro: "Laboratories (Labs) increase the rate that we receive a new scientist. Enter 40 in the field now then click next.",
                    position: 'right'
                  },
                  {
                    intro: "Once you are happy with your orders, issue them by clicking the Order Construction button then let's learn about one option for expanding your land by clicking on <b>Explore</b> in the Navigation menu."
                  },
                ]
              });
          } else if (page == 'game_explore') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! This tutorial will teach you one option for expanding your lands; exploring. If you have already gone through this tutorial, you can click skip to move on to another tutorial.  Exploring requires both soldiers and gold. The total amounts are based on many factors, some of which include your current size and whether you are currently in war or not."
                  },
                  {
                    element: $("th:contains('Exploration Costs (Soldiers)')").next()[0],
                    intro: "The amount of soldiers required for an expedition can be seen here ...",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Exploration Costs (Gold)')").next()[0],
                    intro: "... while the cost of gold is here.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Maximum Explorable Now')").next()[0],
                    intro: "Based on your available resources, you can explore this many acres.",
                    position: 'left'
                  },
                  {
                    element: $("#id_btnExplore")[0],
                    intro: "Give orders for how much to explore by entering a number in this field.  For new provinces, let's explore 50 acres to expand our lands to 450 acres.",
                    position: 'left'
                  },
                  {
                    intro: "Exploration is a very simple way to gain land, but it is also very limited in that your explore pool only grows by a few acres each Day and soon enough you may run out.  It will also become quite costly to explore and there are several things you must know.  You can never have more than 100% of your existing land in exploration and you cannot explore while at least half your land is unbuilt.  There are also some factors that will increase your costs based on your rank within your Kingdom.  It will take time to learn all of the intricacies of exploration; for more information you may visit the Wiki."
                  },
                  {
                    intro: "Exploring also takes time.  Your new lands will slowly be acquired over the next Utopian month (24 hours). Complete your orders by clicking Send Expedition then let's learn more about scientists by clicking on <b>science</b> in your Navigation menu on the left."
                  },
                ]
              });
          } else if (page == 'game_science') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! This tutorial will teach you about Scientists and how they can help strengthen your Province."
                  },
                  {
                    element: $(".advice-message")[0],
                    intro: "This is your scientist generation rate. As each Utopian day passes this will increase until a Scientist has been generated.  Once a Scientist is generated the generation rate will reset.",
                    position: 'right'
                  },
                  {
                    element: $(".advice-message")[0],
                    intro: "There are only a couple ways to increase your scientist generation rate.  Building laboratories or casting the spell Revelation (which is only available to certain races and personalities) will increase the generation rate of Scientists.",
                    position: 'right'
                  },
                  {
                    element: $("#id_new_scientist")[0],
                    intro: "This menu here will allow you to choose the location each new scientist will begin their study.",
                    position: 'right'
                  },
                  {
                    element: $("h2:contains('Current Effects of science')").next()[0],
                    intro: "This table provides a summary of the overall effects your Scientists are producing. Over time, your scientists will progress from Recruit to Novice to Graduate and finally to Professor.  Each promotion increases the benefits you receive.",
                    position: 'right'
                  },
                  {
                    intro: "Recruits have no effect on your science levels and it will take 3 Utopian Days for a Recruit to become a Novice.  Novices require 72 Days of learning to become Graduates who will provide 50% more effect than Novices.  Graduates require an additional 96 hours of learning to become Professors and will then provide 100% more effect than a Novice."
                  },
                  {
                    element: ".science-group",
                    intro: "You may change any Scientists' area of expertise by using these drop-down menus however be warned! For once a Scientist alters their area of expertise they will revert to a Recruit! Might I suggest to start assigning Scientists with the least amount of experience first!",
                    position: 'right'
                  },
                  {
                    intro: "Once you are happy with your assignments you issue them by clicking the Reassign Scientists button at the very bottom."
                  },
                  {
                    intro: "Now let's learn more about your army by clicking on <b>military</b> in your Navigation menu on the left."
                  },
                ]
              });
          } else if (page == 'game_train_army') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! This tutorial will review the military of our Province. If you have already gone through this set-up, you can click skip to move onto another tutorial."
                  },
                  {
                    element: "#id_draft_rate",
                    intro: "This is your draft rate. Higher draft rates generate soldiers faster but at a higher cost!",
                    position: 'right'
                  },
                  {
                    element: "#id_draft_target",
                    intro: "You can set the target maximum portion of your population that will be drafted into Soldiers by setting your draft target here.  Let's begin by setting our draft target to 70% by entering '70' in this field.",
                    position: 'right'
                  },
                  {
                    element: "#id_wage_rate",
                    intro: "You can set your wage level between 50% and 200%. These wages will determine the base effectiveness (or strength) of your military!",
                    position: 'right'
                  },
                  {
                    intro: "Now let's start training our army!"
                  },
                  {
                    element: "#id_unit-quantity_3",
                    intro: "While thieves do not fight in battle they remain essential by gathering intel, sabotaging our enemies and protecting us against enemy thieves. Let's train 1 TPA (Thieves Per Acre) by entering 400 in this field.",
                    position: 'right'
                  },
                  {
                    element: "#id_unit-quantity_1",
                    intro: "Every province needs defense. Use this field to train your defensive specialists.",
                    position: 'right'
                  },
                  {
                    element: "#id_unit-quantity_0",
                    intro: "In order to attack others we will need offense.  Train offensive specialists here to increase your offensive army.",
                    position: 'right'
                  },
                  {
                    element: "#id_unit-quantity_2",
                    intro: "Elites are generally very strong and have both offense and defense. Elites can be expensive therefore careful thought should be made on how to properly allocate our army.  Utilize your resources wisely and develop a powerful military which will help conquer and defend your lands.",
                    position: 'right'
                  },
                  {
                    intro: "Be sure to assign all your available soldiers to their correct categories then click Train Troops. military training takes time therefore your troops will become available daily as they complete their training and join your army."
                  },
                  {
                    intro: "<b>Congratulations! Your Province has now completed the basic steps for set-up.</b> However, our Stewardship is not yet complete and we must press on! For the next step in our tutorial, let's go to the <b>Politics</b> and vote for a Monarch."
                  },
                ]
              });
          } else if (page == 'game_vote') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "If you have joined an existing kingdom, they would likely have already picked and voted for a Monarch. Being a Monarch is no small task, it requires a lot of knowledge of the game mechanics and a certain level of diplomacy, so let's hold off on voting for yourself as Monarch until at least next age."
                  },
                  {
                    element: $("p:contains('advice-message')").next()[0],
                    intro: "For the moment, check who the current monarch is listed as here ...",
                    position: 'left'
                  },
                  {
                    element: "#id_monarch_vote-vote",
                    intro: "... you may then select that name from this drop-down list and click Vote, or visit the <b>Forums</b> in the Navigation bar to the left and join the discussion to determine who will best suit our great Kingdom as Monarch.",
                    position: 'right'
                  },
                  {
                    intro: "For the remainder of your protection phase, we recommend regularly checking on your Growth page to build up new acres you explored as well as the military page to train your newly drafted soldiers.  I also highly suggest checking other tutorials on topics not yet covered to gain the required knowledge to help your Province prosper!"
                  },
                ]
              });
          } else if (page == 'game_train_wizards') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "This is a page dedicated to your Wizards.  You can see various information related to your Wizards but most importantly you use this area to start or stop training of new wizards and if you ever need to release Wizards back into your peasant population that can be done here.  Let's take a look!"
                  },
                  {
                    element: "#id_training_option_0",
                    intro: "Check this box if you would like to stop the training of wizards within your Guilds. It is rare to want to do this, but if you ever need to this is where you give that order.",
                    position: 'right'
                  },
                  {
                    element: "#id_training_option_1",
                    intro: "Make sure this box is checked so our Guilds continue to train wizards.  A powerful wizard population takes a large time investment and dedication to the craft.  As we grow our lands our Wizard Per Acre population will be more difficult to maintain, but is an important measure of our offensive and defensive magic capabilities.  To sustain an adequate wizard population you will want to keep training wizards at all times!",
                    position: 'right'
                  },
                  {
                    element: $("td:contains('Wizards Per Acre')").next()[0],
                    intro: "Here you can see our total number of wizards and what they represent in terms of raw Wizards Per Acre we currently have.  There may be times when you need to release wizards back into your peasant population, let's go through this action now.",
                    position: 'left'
                  },
                  {
                    element: "#id_quantity",
                    intro: "This input box is used to release wizards.  Enter 1 in this field and press the <b>'Give Orders'</b> button.  This will conclude the tutorial for this area.  I advise that you navigate to another area of the game to learn more!",
                    position: 'right'
                  },
                ]
              });
          } else if (page == 'game_province_news_current') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Here you can find any recent News of events that have affected our Province."
                  },
                  {
                    element: "#id_news",
                    intro: "Events of the current Month will be displayed here.",
                    position: 'right'
                  },
                  {
                    intro: "You can find older News from this area as well if you'd like to look back and compile a history of recent events!",
                  },
                ]
              });
          } else if (page == 'game_kingdom_news_current') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Here you can find any recent News of events that have affected our Kingdom.  This is an important area to review regularly.  Our loyal Kingdom will help us prosper and we should always be vigilant of the events of our Kingdom.  This area will show a multitude of information from Aid packets being sent throughout the Kingdom to attacks sent and received by our Kingdom."
                  },
                  {
                    element: "#class_news-legend",
                    intro: "You can see all the different events that can take place within your Kingdom News here.",
                    position: 'left'
                  },
                  {
                    element: "#id_news",
                    intro: "Events of the current Month will be displayed here, take notice of these and past events because all Kingdom relations are determined by the events recorded in these papers.  Is another Kingdom beginning to send a wave of attacks at us?  This is where you will find that information!",
                    position: 'right'
                  },
                  {
                    intro: "You will be able to learn quite a lot from the events and actions of your Kingdom Mates, use this information wisely.",
                  },
                ]
              });
          } else if (page == 'kingdom_topics') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Your Kingdom Forums is a private message board that only Our Kingdom has access to.  Important discussions and information to look back on should be held here.  This is a great place to introduce yourself and get to know your fellow Kingdom Mates!"
                  },
                  {
                    element: "#class_mail-view",
                    intro: "Find all the discussions taking place here.  Complete this tutorial then begin browsing the various Topics to learn the important matters being considered within the Kingdom.",
                    position: 'right'
                  },
                  {
                    element: "#id_id_subject",
                    intro: "To create a new Topic enter the subject here and fill in the content of your message in the body below!",
                    position: 'right'
                  },
                  {
                    element: $("input:contains('Submit Post')"),
                    intro: "If you will be creating a new topic click the Submit Post button here, otherwise click on any existing topic link to see the existing discussion your Kingdom mates are already having and join in!",
                  },
                ]
              });
          } else if (page == 'game_spells_reflexive') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Welcome to your Mystics page! Here you can cast beneficial spells on your own lands. Casting spells requires both mana and runes."
                  },
                  {
                    element: $("h1:contains('Combat Spells')"),
                    intro: "You can click here to access your offensive spells to attack your enemies.",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Runes')"),
                    intro: "Runes are used to cast spells, our total runes can be seen here ...",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Mana')").next()[0],
                    intro: "... and our current mana level is here. To cast spells our mana level must not be below 10%. Mana will regenerate each day and should be used wisely!",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Guilds')").next()[0],
                    intro: "The percentage of your lands built as Guilds will affect the success rate and duration of your self spells.  The more Guilds we have the easier our spells will be to cast and the longer their durations will be.",
                    position: 'right'
                  },
                  {
                    element: "#id_spell",
                    intro: "To cast a spell, select it from this drop-down menu...",
                    position: 'right'
                  },
                  {
                    element: $("input:contains('Cast Spell')"),
                    intro: "... then click the Cast Spell button.",
                    position: 'right'
                  },
                  {                 
                    intro: "Self spells offer a variety of bonuses for our lands.  I suggest learning more about what our Self spells do in the Guide or Wiki."
                  },
                  {
                    intro: "For new Provinces it is recommended that you cast Love and Peace at your first opportunity to increase our birth rates and our peasant population as quickly as possible.  Check back often and cast some spells once you have enough Runes!"
                  },
                  {
                    intro: "This completes our tutorial of Self spells.  Take a look around at some other areas you would like more information on!"
                  },
                ]
              });
          } else if (page == 'game_spells_combat') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! In this tutorial, you will learn how to smite your enemies with your wizards."
                  },
                  {
                    intro: "During hostile situations and war, your Monarch will likely provide a list of targets and potentially which spells for each. The success rate and duration of the spells will depend on your wizards per acre (WPA), your enemy's WPA, modifiers (such as Channeling scientists, Race/Personality, Mage's Fury and Magic Shield spells, and honor bonuses), and the difference in Networth and Land between the two provinces."
                  },
                  {
                    element: $("th:contains('Go')").next()[0],
                    intro: "You will need to enter the kingdom number here then click Go to load them into your target province list.",
                    position: 'right'
                  },
                  {
                    element: "#id_target_province",
                    intro: "Select the target from the drop-down menu.",
                    position: 'right'
                  },
                  {
                    element: "#id_spell",
                    intro: "Then choose which spell to cast. Generally speaking, the lower the rune cost, the easier a spell is to cast.",
                    position: 'right'
                  },
                  { 
                    intro: "A few helpful hints:<ul><li>Do not attempt to cast spells on targets with over 400 NWPA (Networth Per Acre) as they have been greatly reduced in land and likely haven't released any wizards making their WPA very high.<li>Do not cast Storms and Drought on the same target, only one may be active at a time.<li>Whenever possible, have Pitfalls cast upon an enemy prior to attacking them with your army.</ul>"
                  },
                  {
                    intro: "You can learn more about your offensive spells from the <b>Wikipedia</b>, a link is available at the top of the page."
                  },
                ]
              });
          } else if (page == 'game_send_armies') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! In this tutorial, you will learn the basics of attacking with your army."
                  },
                  {
                    element: $("h1:contains('Potential targets')").next()[0],
                    intro: "The first step of attacking is to identify a target. During hostile situations and war, your Monarch will likely provide a list of targets. Outside of those events, you can use the target finder to find some prey.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Deployable Generals')").next()[0],
                    intro: "You must have at least one General available to lead your army in order to attack.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Mercenary Rate')").next()[0],
                    intro: "You can opt to supplement your army by hiring Mercenaries with your gold.",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Go')").next()[0],
                    intro: "You will need to enter the kingdom number here then click Go to load them into your target province list.",
                    position: 'right'
                  },
                  {
                    element: ".thievery",
                    intro: "The second step is to gather intel on their defenses. You can use Spy on military to identify how much defense they have at home.",
                    position: 'right'
                  },
                  {
                    element: $("input:contains('Go')").next()[0],
                    intro: "You will need to enter the kingdom number here then click Go to load them into your target province list.",
                    position: 'right'
                  },
                  {
                    element: "#id_target_province",
                    intro: "From this drop-down, select your prey. The percentages show their relative Networth and Land compared to your province. The closer both of these are to 100%, the more land you may gain.",
                    position: 'right'
                  },
                  {
                    element: "#id_attack_type",
                    intro: "There are several different types of attacks you can perform. You can visit the Wikipedia or Utopia Guide from the links at the top to learn about them all. For the moment, let's stick with the most common, <b>Traditional March</b>. This will capture a portion of the enemy's land for our own.",
                    position: 'right'
                  },
                  {
                    element: "#id_modify_attack_time",
                    intro: "You can use this to impact the return time of your army for a slight benefit or a larger penalty. For most situations, you will not need to use this.",
                    position: 'right'
                  },
                  {
                    element: "#id_general",
                    intro: "You must send at least 1 General to lead your army. If you are just shy of breaching enemy defenses, you can send more Generals to slightly boost your offensive capabilities.",
                    position: 'right'
                  },
                  {
                    element: "#id_target_defense",
                    intro: "Using your thievery intel, enter the enemy's defense points at home here.",
                    position: 'right'
                  },
                  {
                    element: "#id_offensive_ratio",
                    intro: "There is a random factor element to attacks which means to ensure victory, you must send at least 104.04% ratio to target defense.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Send')").next()[0],
                    intro: "To breach their defenses, enter numbers in this column up to the maximum available. If you don't want to send a specific type of troop, you do not need to enter anything in that column.",
                    position: 'right'
                  },
                  {
                    intro: "Before sending your troops out, double check your orders. Is it the right target? The right type of attack? Have you sent at least 104.04% against them? If all yes (or if you accept the risk of a failed attack), then click Prepare military."
                  },
                  {
                    intro: "You will immediately receive a report on your attack. It will advise you whether you were successful, what you gained, your troop losses, the quantity of troops your enemy lost, when your army will return, and potentially, if you or your target are Undead, whether the plague was spread."
                  },
                ]
              });
          } else if (page == 'game_aid') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Welcome to the Aid page where you can help out your Kingdom mates by sending them resources."
                  },
                  {
                    element: $("th:contains('Current trade balance')").next()[0],
                    intro: "Sending resources will give you a positive trade balance while receiving will lower it.  There are no benefits from having a positive trade balance however, once a negative trade balance of 4 times your networth will begin to tax future incoming shipments. As time progresses, trade balance will slowly get decay until you have a zero trade balance.",
                    position: 'left'
                  },
                  {
                    element: "#id_target_province",
                    intro: "You can only send resources to people within your own Kingdom. All Kingdom members allowing Aid shipments will be shown here.  If they are not listed they may be blocking aid or in vacation mode and will be listed below.",
                    position: 'right'
                  },
                  {
                    element: $("th:contains('Quantity to send')").next()[0],
                    intro: "Here you can enter how much of each resource you want to send, up to your current available quantity.  It should also be noted that the maximum shipment size is 400% of the target networth, or 400% of the average Province size within the Kingdom.",
                    position: 'top'
                  },
                  {
                    element: $("th:contains('Soldiers')").next()[0],
                    intro: "Soldiers are a valuable resource.  They provide immediate offense or defense, allow for exploration, an increase in peasant population if released or can be trained into military units and be used for fighting.",
                    position: 'left'
                  },
                  {
                    element: $("th:contains('Explorable Land')").next()[0],
                    intro: "Explorable Land is expensive resource to receive.  The amount sent is reduced by 75% to the recipient and has quite a high price tag.  It should also be carefully noted that the land you are sending is unexplored land and will be added to the recipients explorable land.",
                    position: 'left'
                  },
                ]
              });
          } else if (page == 'game_thievery') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! In this tutorial, you will learn how to sabotage and cause havoc among your enemies with your thieves."
                  },
                  {
                    intro: "During hostile situations and war, your Monarch will likely provide a list of targets and potentially which operations for each. The success rate and duration of the operations will depend on your thieves per acre (TPA), your enemy's TPA, modifiers (such as the Invisibility spell, buildings, Crime scientists, race/personality, and honor bonuses) and the difference in Networth and Land between the two provinces."
                  },
                  {
                    element: $("th:contains('Go')").next()[0],
                    intro: "You will need to enter the kingdom number here then click Go to load them into your target province list.",
                    position: 'right'
                  },
                  {
                    element: "#id_target_province",
                    intro: "Select the target from the drop-down menu.",
                    position: 'right'
                  },
                  {
                    element: "#id_operation",
                    intro: "Then choose which thievery operation to perform.",
                    position: 'right'
                  },
                  {
                    element: "#id_quantity",
                    intro: "Now you'll need to enter how many thieves to send. For the Espionage operations, you only need to send 10% of your thieves for accurate intel. If you are a Tactician, you can just send 1 thief, you'll still get accurate intel. For Sabotage operations, you can send up to 100% if you wish, just be careful as the more you send, the higher your losses will be for failed ops.",
                    position: 'right'
                  },
                  { 
                    intro: "A helpful hint: Do not attempt to perform thievery operations on targets with over 400 NWPA (Networth Per Acre) as they have been greatly reduced in land and likely haven't released any thieves making their TPA very high."
                  },
                  {
                    intro: "You can learn more about your offensive spells from the <b>Wikipedia</b>, a link is available at the top of the page."
                  },
                ]
              });
          } else if (page == 'game_province_target_finder') {
              intro.setOptions({
                steps: [
                  { 
                    intro: "When you are looking for a target to attack, this page is a great resource!"
                  },
                  {
                    element: "#id_range_choices",
                    intro: "Here you can select the range of target provinces near your size. Remember, the closer to 100% your target, the higher your potential battle gains are likely to be.",
                    position: 'right'
                  },
                  {
                    element: "#id_exclude_in_war",
                    intro: "Excluding Kingdoms at war is a wise decision.  War inflicts severe penalties on battle gains to and from enemies not involved in the War.  As such, it is common practice to avoid Kingdoms that are at War to allow them to engage in their conflict uninterrupted from outside forces.",
                    position: 'right'
                  },
                  {
                    element: $("tr:contains('Orc')").next()[0],
                    intro: "Here you can choose to exclude certain races from your target list. Certain races will have innate offensive or defensive qualities and as such may help determine your choices!",
                    position: 'right'
                  },
                  {
                    intro: "Once your list of targets is generated you should begin gathering intelligence and choose a suitable target for an attack!"
                  },
                ]
              });
          } else {
            intro.setOptions({
                steps: [
                  { 
                    intro: "Greetings! We do not yet have a tutorial for this page, sorry!"
                  },
                  ]
              });
          }
          intro.setOption('tooltipClass', 'customDefault').start();
          if (!seen_tutorials.includes(page))
            {
                if (possible_tutorials.includes(page)) {
                  $.ajax({
                        type: 'GET',
                        url: seen_tutorial_url,
                        data: {
                            page: page
                        }
                  });
              }
            // add it in this instance aswell so it doesn't fire multiple times on same page
            seen_tutorials.push(page);
          }
}