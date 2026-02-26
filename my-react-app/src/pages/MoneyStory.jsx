import "./MoneyStory.css";
import { Link } from "react-router-dom";
import { useSiteLang } from "../content/useSiteLang";

export default function MoneyStory() {
  const { text } = useSiteLang();

  return (
    <div className="blogPage">
      <div className="blogPage">
        <div className="blogWrap">
          <Link to="/blog" className="backButton">
            ← {text.common.back}
          </Link>

          <article className="blogWrap">
            <h1 className="blogTitle">Why is it always about the money?</h1>

            <div className="blogMeta">
              <span>by Tracy Nguyen</span>
              <span className="divider">—</span>
              <span>April 12, 2025</span>
            </div>

            <div className="blogDivider" />

            <div className="blogContent">
              <p>
                It’s Friday night, and you are in the mood to order some pizza.
              </p>

              <blockquote>
                <p>
                  <strong>You:</strong> Dad, I am ordering pizza. Would you like
                  any?
                </p>
                <p>
                  <strong>Your dad:</strong> Why do you want to order pizza? We
                  have lot of food at home.
                </p>
              </blockquote>

              <p>
                Here we go again. Whenever you order something home to eat, your
                parents would complain about how expensive it is. They believe
                that you are wasting money. Even though if you offer them some
                of the food, they would happily accept. You don’t get it:{" "}
                <em>
                  What they are complaining about if they did not have to spend
                  any money, and they enjoy the food just as much as I do?
                </em>{" "}
                And yet, they eat, and complain about it all at the same time
                and tell you not to waste your money like that next time.
              </p>
              <h3>It’s the same questions:</h3>
              <ul>
                <li>Do you need to buy that?</li>
                <li>
                  Why do you want to buy that? Is it necessary? Do you need it?
                </li>
                <li>
                  Do you really need to spend money on that? What do you need it
                  for?
                </li>
              </ul>
              <h3>It’s the same messages:</h3>
              <ul>
                <li>Don’t spend too much money.</li>
                <li>
                  You need to save for rainy days. We don’t know what the future
                  holds.
                </li>
                <li>
                  With the unpredictable economy like now, how can you be sure
                  that your job is guarantee?
                </li>
                <li>
                  If you want to have a family of your own one day, you should
                  start saving for a house down payment.
                </li>
              </ul>
              <p>
                It’s the constant worry about money. And you are tired of it.
              </p>
              <p>
                You understand that your parents came here to Canada with
                nothing. They had to start from scratch with nobody to rely on.
                With 2 little ones to take care of, it made more sense for your
                mom to stay home, and take care of you and your sister. Your dad
                had to work two jobs to make ends meet. Growing up, you only saw
                him in the weekend, and all he did at home was to watch tv. He
                was so drained and exhausted from his manual laboring jobs that
                he had no energy left to check up on you kids.
              </p>
              <p>
                For your parents, money was tight. Yor overheard them arguing
                about money. Mom would ask for more money for grocery, as you
                kids’ appetite kept expanding as you kept growing. On top of
                that, family members back home would call from times to times
                asking for money. It could be anything: Some uncle needed money
                for an urgent surgery; Some auntie just passed, they needed
                money for a wedding or funeral; etc. Mom would not spend
                anything on herself. She would wear the clothes that dad does
                not want anymore. For her, clothing is not important. As long as
                it does not have any hole, it is good enough for her. She would
                save every penny, and send back home whenever she has a chance.
                She always tells you kids that: It’s a blessing that we can come
                here to Canada. We have the duty to support those back home who
                don’t have. They depend on us. Dad would tell her to make do; He
                already worked 2 jobs: What else do you want me to do? It was a
                constant fight about money.
              </p>
              <p>
                Growing up, you guys never went out to eat as a family. The only
                place that you could go to for special occasions was McDonald.
                Whenever you got a Happy Meal, it made your day. You treasured
                the little toy that you got from there so much and you would
                play with it for days on end. You learned to go without things.
                Mom would give you bus fare money to get to school and back. You
                walked instead, and saved that money to buy toys or snacks. The
                moment you could work, you asked your mom if you could deliver
                newspaper. You found any odds jobs that would make you some
                money.
              </p>
              <p>
                You have never been the type that is afraid of working. In fact,
                you worked so hard in school to get an University degree. And
                now, thanks to all your efforts, you landed a very good job with
                lots of benefits. Life is different now comparing to when they
                first came here. You get paid more in a month than what your dad
                made in a year. You make more than enough for yourself, and then
                some to save on the side. You know you are financially
                responsible. Plus, you’re still single, and no commitment yet.
                One day, you might want to marry and move out, but until then,
                you still want to spend time with your parents. You do
                contribute to the house, but it’s nothing comparing to paying
                rent outside. Your mom still cook your favorite meals. She still
                does the laundry for you. Your parents are just happy that you
                still want to live at home with them. And you want to enjoy your
                hard-earned money with your parents while you can. You think
                that your parents should be proud of you and appreciate you. But
                no, it’s quite the opposite. It’s the constant reminder of
                spending wisely or better yet, not spending at all.
              </p>
              <p>
                It hurts whenever your parents talk to you about saving. For
                you, it is sign that they do not trust you and your
                decision-making. You might ask yourself:
              </p>
              <div className="pullQuestions">
                <p>
                  Why don’t they trust me for once? When would they trust me?
                </p>
                <p>
                  I have always been so responsible yet they still don’t trust
                  me.
                </p>
                <p>
                  This is so frustrating. This is my money. This is my life.
                </p>
                <p>I am tired of they nagging me about saving all the time.</p>
                <p>Am I not good enough for them?</p>
              </div>
              <p>
                Well, there are a few things that you can do to handle these
                kinds of situations in the future:
              </p>
              <ol className="steps">
                <li>
                  It might help to understand that your parents can tie money to
                  their sense of Security. They never had that kind of financial
                  security when they first came here. With so little they had,
                  there was not much to go around. The lack of money was
                  associated with stress and worries. So now, even though things
                  are better, they still feel the need to save up, just in case.
                </li>
                <li>
                  The next time they start to nag you again about spending
                  money, look them in the eyes, smile, and tell them calmly:
                  <span className="quoteBlock">
                    “Thank you, Dad (or Mom), for trying to look out for me. I
                    appreciate that you always want the best for me. I know that
                    you want me to save as much as I can so I can have a good
                    future. But what I really need right now is for you to
                    believe in me. I want you to trust my decision making. I got
                    this.”
                  </span>
                  And if they continue to explain themselves thinking that you
                  haven’t got the memo, you can tell them something along the
                  line:
                  <span className="quoteBlock">
                    “I know you mean well, Dad (or Mom). And I do appreciate
                    your concern. However, if you continue to nag me about this,
                    I will need to stop talking. I hope you understand, but I do
                    not want to engage in this conversation any more. All I need
                    from you right now is to trust me with my money. Allow me to
                    make mistakes if I have to. I need to learn it for myself,
                    not just by you constantly tell me what to do.”
                  </span>
                </li>
                <li>
                  It might be awkward in the beginning. But if you really mean
                  what you say, and you say it calmly and collectively, they’ll
                  eventually get the message. They might not know what to say
                  next or change topics, but you won’t have to listen to the
                  same message over and over again. Worst case scenario, they
                  keep talking about it, just remove yourself from the room.
                  Tell them something like: I gotta go. Sorry.
                </li>
                <li>
                  They might never change the way they relate to money. They
                  might still believe that they need show you how they care by
                  telling you what to do with your money. But you can change the
                  way the conversation goes, but expressing how you want to be
                  treated. When you express your appreciation for their good
                  intention, you signal to them that you understand why they say
                  what they say to you. You know that they do it out of love for
                  you. When you tell them what you want them to say back to you,
                  you teach them how to give you what you need from them at that
                  time. Oftentimes, they love you deeply, but they do not know
                  how to relate to you or give you the kind of support that you
                  need as you get older. You still want their love, but you
                  don’t need them to micro-manage you. You need their trust and
                  moral support than their lectures. So help them out by
                  literally giving them the words you want to hear, and ask them
                  to repeat back to you. Once they realize that you are just
                  trying to improve your relationship with each other, they will
                  be more open to change. And you will have a much healthier
                  relationship with your old folks.
                </li>
              </ol>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
