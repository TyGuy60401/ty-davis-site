function buildHeader(subtitleText) {
    fetch('/src/header.html')
      .then(response => response.text())
      .then(html => {
        const container = document.querySelector('#header');
        container.innerHTML = html;
        let subtitle = document.querySelector('#subtitle');
        subtitle.innerHTML = '- ' + subtitleText;
      });
}