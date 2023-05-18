import React, { useEffect, useState } from "react";
import gsap from 'gsap'

const API_TOKEN = "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";

const ImageGenerationForm = ({
  sendItBack,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    initLogic()
  }, [])

  const initLogic = async (event) => {
    document.querySelectorAll('.auto-height').forEach(el => {
      let ta = el.querySelector('textarea');
      el.style.height = el.setAttribute('style', 'height: ' + ta.scrollHeight + 'px');
      ta.classList.add('overflow');
      ta.addEventListener('input', e => {
        ta.style.height = 'auto';
        let height = ta.scrollHeight;
        ta.style.height = '100%';
        gsap.to(el, {
          height: height,
          duration: .1,
          onUpdate() {
            ta.scrollTo(0, 0);
          }
        });
      });
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    
    setLoading(true);
    
    const input = event.target.elements.input.value;
    console.log(input)
    // return
    const response = await fetch(
      "https://api-inference.huggingface.co/models/prompthero/openjourney",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ inputs: input }),
      }
    );

    // console.log('response')
    // console.log(response)

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const blob = await response.blob();
    setOutput(URL.createObjectURL(blob));
    setLoading(false);

    sendItBack(URL.createObjectURL(blob))
  };

  return (
    <div className="prompt-container al-c mt-3">
      <h1>A<span>I</span>RT</h1>
      <h2 className="description">What do you wish this art piece to be?</h2>
      <form className="gen-form" onSubmit={handleSubmit}>

        <div className="auto-height">
          {/* <input name="input" class="input__field input__field--hoshi" type="text" id="input-4" /> */}
          <textarea
            name="input"
            rows="1"
            id="input-4"
            onFocus={(e) => e.target.select()}
            placeholder="Describe your art piece"
          ></textarea>
        </div>
        
        {/* <input type="text" name="input" placeholder="Describe your art piece here" /> */}
        {/* <span class="input input--hoshi">
          <input name="input" class="input__field input__field--hoshi" type="text" id="input-4" />
          <label class="input__label input__label--hoshi input__label--hoshi-color-1" for="input-4">
            <span class="input__label-content input__label-content--hoshi">Describe your art piece here</span>
          </label>
        </span> */}

        <button className="btn draw-border" type="submit">Generate</button>
      </form>
      <div>
        {loading && <h3 className="loading">Creating art piece ...</h3>}
        {!loading && output && (
          <div className="result-image">
            <img src={output} alt="art" />
          </div>
        )}
      </div>

    </div>);

};

export default ImageGenerationForm;