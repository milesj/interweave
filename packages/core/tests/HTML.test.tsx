import React from 'react';
import { shallow } from 'enzyme';
import Markup from '../src/Markup';

// All examples taken from MDN https://developer.mozilla.org/en-US/docs/Web/HTML/Element
describe('html', () => {
  describe('a, ul, li', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<ul>
  <li><a href="https://example.com">Website</a></li>
  <li><a href="mailto:m.bluth@example.com">Email</a></li>
  <li><a href="tel:+123456789">Phone</a></li>
</ul>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('abbr', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`You can use <abbr title="Cascading Style Sheets">CSS</abbr> to style your <abbr title="HyperText Markup Language">HTML</abbr>.`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('address', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<address>
  <a href="mailto:jim@rock.com">jim@rock.com</a><br/>
  <a href="tel:+311-555-2368">+311-555-2368</a><br/>
</address>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('article', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<article class="forecast">
  <h1>Weather forecast for Seattle</h1>
  <article class="day-forecast">
    <h2>03 March 2018</h2>
    <p>Rain.</p>
  </article>
  <article class="day-forecast">
    <h2>04 March 2018</h2>
    <p>Periods of rain.</p>
  </article>
  <article class="day-forecast">
    <h2>05 March 2018</h2>
    <p>Heavy rain.</p>
  </article>
</article>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('aside', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<aside>
  <p>The Rough-skinned Newt defends itself with a deadly neurotoxin.</p>
</aside>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('audio', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<audio controls src="/media/examples/t-rex-roar.mp3">
  Your browser does not support the <code>audio</code> element.
</audio>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('renders with source', () => {
      const wrapper = shallow(
        <Markup
          content={`<audio controls="controls">
  <source src="foo.wav" type="audio/wav">
  Your browser does not support the <code>audio</code> element.
</audio>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('b', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<p>The two most popular science courses offered by the school are <b class="term">chemistry</b> (the study of chemicals and the composition of substances) and <b class="term">physics</b> (the study of the nature and properties of matter and energy).</p>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('bdi', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<ul>
  <li><bdi class="name">Evil Steven</bdi>: 1st place</li>
  <li><bdi class="name">François fatale</bdi>: 2nd place</li>
  <li><span class="name">تیز سمی</span>: 3rd place</li>
  <li><bdi class="name">الرجل القوي إيان</bdi>: 4th place</li>
  <li><span class="name" dir="auto">تیز سمی</span>: 5th place</li>
</ul>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('bdo', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`In the computer's memory, this is stored as <bdo dir="ltr">אה, אני אוהב להיות ליד חוף הים</bdo>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('blockquote', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<blockquote cite="https://www.huxley.net/bnw/four.html">
  <p>Words can be like X-rays, if you use them properly – they'll go through anything. You read and you're pierced.</p>
</blockquote>

<cite>– Aldous Huxley, Brave New World</cite>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('button', () => {
    it('renders', () => {
      const wrapper = shallow(<Markup content={`<button name="button">Click me</button>`} />);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('canvas', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<canvas id="canvas" width="300" height="300">
  An alternative text describing what your canvas displays.
</canvas>`}
          allowList={['canvas']}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('renders nothing when not allowed', () => {
      const wrapper = shallow(
        <Markup
          content={`<canvas id="canvas" width="300" height="300">
  An alternative text describing what your canvas displays.
</canvas>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('caption', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<table>
  <caption>He-Man and Skeletor facts</caption>
  <tr>
    <td> </td>
    <th scope="col" class="heman">He-Man</th>
    <th scope="col" class="skeletor">Skeletor</th>
  </tr>
</table>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('cite', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<blockquote>
  <p>It was a bright cold day in April, and the clocks were striking thirteen.</p>
  <footer>
    First sentence in <cite><a href="http://www.george-orwell.org/1984/0.html"><i>Nineteen Eighty-Four</i></a></cite> by George Orwell (Part 1, Chapter 1).
  </footer>
</blockquote>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('code', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<p>The <code>push()</code> method adds one or more elements to the end of an array and returns the new length of the array.</p>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('col, colgroup', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<table>
  <caption>Superheros and sidekicks</caption>
  <colgroup>
    <col>
    <col span="2" class="batman">
    <col span="2" class="flash">
  </colgroup>
</table>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('dl, dt, dd', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<dl>
  <dt>Beast of Bodmin</dt>
  <dd>A large feline inhabiting Bodmin Moor.</dd>

  <dt>Morgawr</dt>
  <dd>A sea serpent.</dd>

  <dt>Owlman</dt>
  <dd>A giant owl-like creature.</dd>
</dl>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('details, summary', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<details>
  <summary>Details</summary>
  Something small enough to escape casual notice.
</details>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('doesnt render summary when not in details', () => {
      const wrapper = shallow(<Markup content={`<summary>Details</summary>`} />);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('dfn', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<p>A <dfn id="def-validator">validator</dfn> is a program that checks for syntax errors in code or documents.</p>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('div', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<div class="warning">
  <img src="/media/examples/leopard.jpg" alt="An intimidating leopard.">
  <p>Beware of the leopard</p>
</div>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('em', () => {
    it('renders', () => {
      const wrapper = shallow(<Markup content={`We <em>had</em> to do something about it.`} />);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('figure, figcaption', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<figure>
  <img src="/media/examples/elephant-660-480.jpg" alt="Elephant at sunset" />
  <figcaption>An elephant at sunset</figcaption>
</figure>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('footer', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<article>
  <h1>How to be a wizard</h1>
  <ol>
    <li>Grow a long, majestic beard.</li>
    <li>Wear a tall pointed hat.</li>
    <li>Have I mentioned the beard?</li>
  </ol>
  <footer>
    <p>© 2018 Gandalf</p>
  </footer>
</article>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('h1 - h6', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<h1>Beetles</h1>
      <h2>External morphology</h2>
          <h3>Head</h3>
              <h4>Mouthparts</h4>
          <h3>Thorax</h3>
              <h5>Prothorax</h5>
              <h6>Pterothorax</h6>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('header', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<header class="page-header">
  <h1>Cute Puppies Express!</h1>
</header>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('hr', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<p>§1: The first rule of Fight Club is: You do not talk about Fight Club.</p>
<hr>
<p>§2: The second rule of Fight Club is: Always bring cupcakes.</p>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('i', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<p><i class="latin">Musa</i> is one of two or three genera in the family <i class="latin">Musaceae</i>; it includes bananas and plantains.</p>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('iframe', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<iframe width="400" height="300" src="https://maps.google.com"></iframe>`}
          allowList={['iframe']}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('renders nothing when not allowed', () => {
      const wrapper = shallow(
        <Markup
          content={`<iframe width="400" height="300" src="https://maps.google.com"></iframe>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('img', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<img class="fit-picture" src="/media/examples/grapefruit-slice-332-332.jpg" alt="Grapefruit slice atop a pile of other slices" />`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('ins', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<ins cite="../howtobeawizard.html" datetime="2018-05">
  <p>“A wizard is never late …”</p>
</ins>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('kbd', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`Please press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> to re-render an MDN page.`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('main', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<main role="main">
  <p>Geckos are a group of usually small, usually nocturnal lizards. They are found on every continent except Australia.</p>
</main>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mark', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`Most <mark>salamander</mark>s are nocturnal, and hunt for insects, worms, and other small creatures.`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('nav, ol, li', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<nav class="crumbs">
  <ol>
    <li class="crumb"><a href="bikes">Bikes</a></li>
    <li class="crumb"><a href="bikes/bmx">BMX</a></li>
    <li class="crumb">Jump Bike 3000</li>
  </ol>
</nav>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('picture', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<picture>
  <source srcset="/media/examples/surfer-240-200.jpg" media="(min-width: 800px)">
  <img src="/media/examples/painted-hand-298-332.jpg" />
</picture>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('pre', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<pre>
  L          TE
    A       A
      C    V
        R A
        DOU
        LOU
      REUSE
      QUE TU
      PORTES
    ET QUI T'
    ORNE O CI
      VILISÉ
    OTE-  TU VEUX
      LA    BIEN
    SI      RESPI
            RER       - Apollinaire
</pre>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('q', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`When Dave asks HAL to open the pod bay door, HAL answers: <q cite="https://www.imdb.com/title/tt0062622/quotes/qt0396921">I'm sorry, Dave. I'm afraid I can't do that.</q>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('ruby, rp, rt, rtc', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<ruby xml:lang="zh-Hant" style="ruby-position: under;">
  <rbc>
    <rb>馬</rb><rp>(</rp><rt>mǎ</rt><rp>)</rp>
    <rb>來</rb><rp>(</rp><rt>lái</rt><rp>)</rp>
    <rb>西</rb><rp>(</rp><rt>xī</rt><rp>)</rp>
    <rb>亞</rb><rp>(</rp><rt>yà</rt><rp>)</rp>
  </rbc>
  <rtc xml:lang="en" style="ruby-position: over;">
    <rp>(</rp><rt>Malaysia</rt><rp>)</rp>
  </rtc>
</ruby>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('s', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Markup
          content={`<s>There will be a few tickets available at the box office tonight.</s>`}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
