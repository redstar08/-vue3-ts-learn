class PopupBox extends HTMLElement {
  constructor(props: any) {
    super()
    console.log('props', props)
  }

  connectedCallback() {
    console.log('connectedCallback -> run')
    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' })
    // Create spans
    const wrapper = document.createElement('div')
    wrapper.setAttribute('class', 'wrapper')

    const icon = document.createElement('span')
    icon.setAttribute('class', 'icon')
    icon.setAttribute('tabindex', '0')

    const info = document.createElement('span')
    info.setAttribute('class', 'info')

    // Take attribute content and put it inside the info span
    const text = this.getAttribute('data-text')
    info.textContent = text

    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style')

    style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        border-radius: 10px;
        transition: 0.6s all;
      }
    `

    // Attach the created elements to the shadow dom
    wrapper.appendChild(icon)
    wrapper.appendChild(info)

    shadow.appendChild(style)
    shadow.appendChild(wrapper)
  }

  disconnectedCallback() {
    console.log('disconnectedCallback -> run')
  }

  adoptedCallback() {
    console.log('adoptedCallback -> run')
  }

  attributeChangedCallback() {
    console.log('attributeChangedCallback -> run')
  }
}

customElements.define('my-popup-box', PopupBox)
