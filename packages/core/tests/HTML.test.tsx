import React from 'react';
import { render } from 'rut-dom';
import Markup from '../src/Markup';
import { MarkupProps } from '../src/types';

// All examples taken from MDN https://developer.mozilla.org/en-US/docs/Web/HTML/Element
describe('html', () => {
	describe('a, ul, li', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<ul>
  <li><a href="https://example.com">Website</a></li>
  <li><a href="mailto:m.bluth@example.com">Email</a></li>
  <li><a href="tel:+123456789">Phone</a></li>
</ul>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('abbr', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`You can use <abbr title="Cascading Style Sheets">CSS</abbr> to style your <abbr title="HyperText Markup Language">HTML</abbr>.`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('address', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<address>
  <a href="mailto:jim@rock.com">jim@rock.com</a><br/>
  <a href="tel:+311-555-2368">+311-555-2368</a><br/>
</address>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('article', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('aside', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<aside>
  <p>The Rough-skinned Newt defends itself with a deadly neurotoxin.</p>
</aside>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('audio', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<audio controls src="/media/examples/t-rex-roar.mp3">
  Your browser does not support the <code>audio</code> element.
</audio>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});

		it('renders with source', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<audio controls="controls">
  <source src="foo.wav" type="audio/wav">
  Your browser does not support the <code>audio</code> element.
</audio>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('b', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<p>The two most popular science courses offered by the school are <b class="term">chemistry</b> (the study of chemicals and the composition of substances) and <b class="term">physics</b> (the study of the nature and properties of matter and energy).</p>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('bdi', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('bdo', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`In the computer's memory, this is stored as <bdo dir="ltr">אה, אני אוהב להיות ליד חוף הים</bdo>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('blockquote', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<blockquote cite="https://www.huxley.net/bnw/four.html">
  <p>Words can be like X-rays, if you use them properly – they'll go through anything. You read and you're pierced.</p>
</blockquote>

<cite>– Aldous Huxley, Brave New World</cite>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('button', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup content={`<button name="button">Click me</button>`} />,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('canvas', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<canvas id="canvas" width="300" height="300">
  An alternative text describing what your canvas displays.
</canvas>`}
					allowList={['canvas']}
				/>,
			);

			expect(result).toMatchSnapshot();
		});

		it('renders nothing when not allowed', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<canvas id="canvas" width="300" height="300">
  An alternative text describing what your canvas displays.
</canvas>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('caption', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('cite', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<blockquote>
  <p>It was a bright cold day in April, and the clocks were striking thirteen.</p>
  <footer>
    First sentence in <cite><a href="http://www.george-orwell.org/1984/0.html"><i>Nineteen Eighty-Four</i></a></cite> by George Orwell (Part 1, Chapter 1).
  </footer>
</blockquote>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('code', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<p>The <code>push()</code> method adds one or more elements to the end of an array and returns the new length of the array.</p>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('col, colgroup', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('dl, dt, dd', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('details, summary', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<details>
  <summary>Details</summary>
  Something small enough to escape casual notice.
</details>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});

		it('doesnt render summary when not in details', () => {
			const result = render<MarkupProps>(<Markup content={`<summary>Details</summary>`} />);

			expect(result).toMatchSnapshot();
		});
	});

	describe('dfn', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<p>A <dfn id="def-validator">validator</dfn> is a program that checks for syntax errors in code or documents.</p>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('div', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<div class="warning">
  <img src="/media/examples/leopard.jpg" alt="An intimidating leopard.">
  <p>Beware of the leopard</p>
</div>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('em', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup content={`We <em>had</em> to do something about it.`} />,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('figure, figcaption', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<figure>
  <img src="/media/examples/elephant-660-480.jpg" alt="Elephant at sunset" />
  <figcaption>An elephant at sunset</figcaption>
</figure>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('footer', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('h1 - h6', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('header', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<header class="page-header">
  <h1>Cute Puppies Express!</h1>
</header>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('hr', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<p>§1: The first rule of Fight Club is: You do not talk about Fight Club.</p>
<hr>
<p>§2: The second rule of Fight Club is: Always bring cupcakes.</p>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('i', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<p><i class="latin">Musa</i> is one of two or three genera in the family <i class="latin">Musaceae</i>; it includes bananas and plantains.</p>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('iframe', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<iframe width="400" height="300" src="https://maps.google.com"></iframe>`}
					allowList={['iframe']}
				/>,
			);

			expect(result).toMatchSnapshot();
		});

		it('renders nothing when not allowed', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<iframe width="400" height="300" src="https://maps.google.com"></iframe>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('img', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<img class="fit-picture" src="/media/examples/grapefruit-slice-332-332.jpg" alt="Grapefruit slice atop a pile of other slices" />`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('ins', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<ins cite="../howtobeawizard.html" datetime="2018-05">
  <p>“A wizard is never late …”</p>
</ins>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('kbd', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`Please press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> to re-render an MDN page.`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('main', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<main role="main">
  <p>Geckos are a group of usually small, usually nocturnal lizards. They are found on every continent except Australia.</p>
</main>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('mark', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`Most <mark>salamander</mark>s are nocturnal, and hunt for insects, worms, and other small creatures.`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('nav, ol, li', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('picture', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<picture>
  <source srcset="/media/examples/surfer-240-200.jpg" media="(min-width: 800px)">
  <img src="/media/examples/painted-hand-298-332.jpg" />
</picture>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('pre', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('q', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`When Dave asks HAL to open the pod bay door, HAL answers: <q cite="https://www.imdb.com/title/tt0062622/quotes/qt0396921">I'm sorry, Dave. I'm afraid I can't do that.</q>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('ruby, rp, rt, rtc', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
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

			expect(result).toMatchSnapshot();
		});
	});

	describe('s', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<s>There will be a few tickets available at the box office tonight.</s>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('samp', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup content={`<samp>Keyboard not found <br>Press F1 to continue</samp>`} />,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('section', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<section>
  <h1>Introduction</h1>
  <p>People have been catching fish for food since before recorded history...</p>
</section>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('small', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<p><small>The content is licensed under a Creative Commons Attribution-ShareAlike 2.5 Generic License.</small></p>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('source', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<video controls width="250" height="200" muted>
  <source src="/media/examples/flower.webm" type="video/webm">
  <source src="/media/examples/flower.mp4" type="video/mp4">
  This browser does not support the HTML5 video element.
</video>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});

		it('doesnt render if outside its parent', () => {
			const result = render<MarkupProps>(
				<Markup content={`<source src="/media/examples/flower.webm" type="video/webm">`} />,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('span', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`Add the <span class="ingredient">basil</span>, <span class="ingredient">pine nuts</span> and <span class="ingredient">garlic</span> to a blender and blend into a paste.`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('strong', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`... the most important rule, the rule you can never forget, no matter how much he cries, no matter how much he begs: <strong>never feed him after midnight</strong>.`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('sub', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`Almost every developer's favorite molecule is
          C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>, also known as "caffeine."`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('sup', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<var>a<sup>2</sup></var> + <var>b<sup>2</sup></var> = <var>c<sup>2</sup></var>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('table, thead, tbody, tfoot', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<table>
  <thead>
    <tr>
      <th>Items</th>
      <th scope="col">Expenditure</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Donuts</th>
      <td>3,000</td>
    </tr>
    <tr>
      <th scope="row">Stationary</th>
      <td>18,000</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Totals</th>
      <td>21,000</td>
    </tr>
  </tfoot>
</table>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});

		it('renders table with direct rows', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<table>
  <tr>
    <th scope="row">Donuts</th>
    <td>3,000</td>
  </tr>
  <tr>
    <th scope="row">Stationary</th>
    <td>18,000</td>
  </tr>
</table>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('thead', () => {
		it('doesnt render outside of table', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<thead>
  <tr>
    <th>Items</th>
    <th scope="col">Expenditure</th>
  </tr>
</thead>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('tbody', () => {
		it('doesnt render outside of table', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<tbody>
  <tr>
    <th scope="row">Donuts</th>
    <td>3,000</td>
  </tr>
</tbody>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('tfoot', () => {
		it('doesnt render outside of table', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<tfoot>
  <tr>
    <th scope="row">Totals</th>
    <td>21,000</td>
  </tr>
</tfoot>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('tr', () => {
		it('doesnt render outside of table', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<tr>
  <th scope="row">Donuts</th>
  <td>3,000</td>
</tr>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('td', () => {
		it('doesnt render outside of tr', () => {
			const result = render<MarkupProps>(<Markup content={`<td>3,000</td>`} />);

			expect(result).toMatchSnapshot();
		});
	});

	describe('th', () => {
		it('doesnt render outside of tr', () => {
			const result = render<MarkupProps>(<Markup content={`<th scope="row">Donuts</th>`} />);

			expect(result).toMatchSnapshot();
		});
	});

	describe('time', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`The Cure will be celebrating their 40th anniversary on <time datetime="2018-07-07">July 7</time> in London's Hyde Park.`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('track', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<video controls width="250" src="/media/examples/friday.mp4">
  <track default kind="captions" srclang="en" src="/media/examples/friday.vtt"/>

  Sorry, your browser doesn't support embedded videos.
</video>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});

		it('doesnt render if outside its parent', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<track default kind="captions" srclang="en" src="/media/examples/friday.vtt"/>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('u', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<p>You could use this element to highlight <u>speling</u> mistakes, so the writer can <u>corect</u> them.</p>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('var', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`The volume of a box is <var>l</var> × <var>w</var> × <var>h</var>, where <var>l</var> represents the length, <var>w</var> the width and <var>h</var> the height of the box.`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('video', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup
					content={`<video controls>
  <source src="myVideo.mp4" type="video/mp4">
  <source src="myVideo.webm" type="video/webm">
  <p>Your browser doesn't support HTML5 video. Here is a <a href="myVideo.mp4">link to the video</a> instead.</p>
</video>`}
				/>,
			);

			expect(result).toMatchSnapshot();
		});
	});

	describe('wbr', () => {
		it('renders', () => {
			const result = render<MarkupProps>(
				<Markup content={`Fernstraßen<wbr>bau<wbr>privat<wbr>finanzierungs<wbr>gesetz`} />,
			);

			expect(result).toMatchSnapshot();
		});
	});
});
