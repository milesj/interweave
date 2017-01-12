import React from 'react';
import ReactDOM from 'react-dom';
import Interweave from '../src/Interweave';
import EmailMatcher from '../src/matchers/Email';
import EmojiMatcher from '../src/matchers/Emoji';
import HashtagMatcher from '../src/matchers/Hashtag';
import IpMatcher from '../src/matchers/Ip';
import UrlMatcher from '../src/matchers/Url';

function App() {
  const contentWithNewLines = `This block has multiple new lines.
Like how is this supposed to work.
Someone please.
Tell.
Me.

Help!`;
  const contentWithBrs = `This block has multiple new lines but uses \`br\`s.<br />
Like how is this supposed to work.<br />
Someone please.<br />
Tell.<br />
Me.<br /><br />
Help!`;

  return (
    <div className="interweave__examples">
      <Interweave
        tagName="div"
        content={'This has &apos; entities &quot; in it &dot;.'}
      />

      <Interweave
        tagName="div"
        matchers={[new EmailMatcher('email')]}
        content="This is a string that contains an email: email@domain.com."
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertShortName: true })]}
        content="This will convert :cat: :dog: emoji shortnames :man: to PNGs."
        emojiPath="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.6/assets/png/{{hexcode}}.png"
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true })]}
        content={'This will convert \uD83D\uDC31 \uD83D\uDC36 emoji unicode escapes \uD83D\uDC68 to PNGs.'}
        emojiPath="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.6/assets/png/{{hexcode}}.png"
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true })]}
        content="This will convert 🐱 🐶 emoji unicode literals 👨 to PNGs."
        emojiPath="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.6/assets/png/{{hexcode}}.png"
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, convertShortName: true })]}
        content={'This will convert 🐱 \uD83D\uDC36 all 3 emoji types at once :man: to PNGs.'}
        emojiPath="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.6/assets/png/{{hexcode}}.png"
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertShortName: true, renderUnicode: true })]}
        content="This will convert :cat: :dog: emoji shortnames :man: to unicode literals."
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true })]}
        content={'This will convert \uD83D\uDC31 \uD83D\uDC36 emoji unicode escapes \uD83D\uDC68 to unicode literals.'}
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true })]}
        content="This will render 🐱 🐶 emoji unicode literals 👨 as is."
      />

      <Interweave
        tagName="div"
        content={'This will render \uD83D\uDC31 \uD83D\uDC36 emoji unicode escapes \uD83D\uDC68 as is (no matcher).'}
      />

      <Interweave
        tagName="div"
        content="This will render 🐱 🐶 emoji unicode literals 👨 as is (no matcher)."
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji')]}
        content="This will not convert :cat: :dog: emoji shortnames :man:."
      />

      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true })]}
        content="🐶"
        emojiPath="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.6/assets/png/{{hexcode}}.png"
      />

      <Interweave
        tagName="div"
        matchers={[new HashtagMatcher('hashtag')]}
        content="This #block of text has multiple hashtags. #blessed"
      />

      <Interweave
        tagName="div"
        matchers={[new HashtagMatcher('hashtag')]}
        content="#interweave #java-script Let's encode hashtags and link to Twitter."
        hashtagUrl="https://twitter.com/hashtag/{{hashtag}}"
        encodeHashtag
      />

      <Interweave
        tagName="div"
        matchers={[new IpMatcher('ip')]}
        content="This is a tricky one (https://127.0.0.1) as it contains multiple IPs
          0.0.0.0 in different formats: 76.115.128.58/foo/bar"
      />

      <Interweave
        tagName="div"
        matchers={[new UrlMatcher('url')]}
        content="And of course URLS: milesj.me. This should work just fine,
          https://facebook.github.io/react (I hope). www.github.com."
      />

      <Interweave
        tagName="div"
        content={contentWithNewLines}
      />

      <Interweave
        tagName="div"
        content={contentWithBrs}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
