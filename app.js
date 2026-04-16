const postsContainer = document.getElementById('posts');
const postText = document.getElementById('postText');
const postButton = document.getElementById('postButton');

let posts = [];

function renderPosts() {
  postsContainer.innerHTML = '';

  posts.slice().reverse().forEach((post, indexReverse) => {
    const index = posts.length - 1 - indexReverse;
    const card = document.createElement('div');
    card.className = 'post-card';

    card.innerHTML = `
      <div class="post-meta">
        <div>
          <div class="post-author">ব্যবহারকারী</div>
          <div class="post-time">${post.createdAt}</div>
        </div>
        <div class="post-counts">
          ${post.likes} লাইক · ${post.comments.length} মন্তব্য
        </div>
      </div>
      <div class="post-text">${escapeHtml(post.content)}</div>
      <div class="post-actions">
        <button class="action-button" data-action="like" data-index="${index}">👍 লাইক</button>
        <button class="action-button" data-action="comment-toggle" data-index="${index}">💬 মন্তব্য</button>
      </div>
      <div class="comment-section" id="comments-${index}">
        <div class="comment-list">
          ${post.comments.map(comment => `<div class="comment-item"><strong>আপনি:</strong> <span>${escapeHtml(comment)}</span></div>`).join('')}
        </div>
        <form class="comment-form" data-index="${index}">
          <input type="text" placeholder="কমেন্ট লিখুন..." name="comment" />
          <button type="submit" class="action-button">পাঠান</button>
        </form>
      </div>
    `;

    const commentSection = card.querySelector(`#comments-${index}`);
    commentSection.style.display = 'none';

    postsContainer.appendChild(card);
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function addPost() {
  const content = postText.value.trim();
  if (!content) return;

  posts.push({
    content,
    likes: 0,
    comments: [],
    createdAt: new Date().toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  postText.value = '';
  postButton.disabled = true;
  renderPosts();
}

postText.addEventListener('input', () => {
  postButton.disabled = postText.value.trim().length === 0;
});

postButton.addEventListener('click', addPost);

postsContainer.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);

  if (action === 'like') {
    posts[index].likes += 1;
    renderPosts();
  }

  if (action === 'comment-toggle') {
    const commentSection = document.getElementById(`comments-${index}`);
    if (commentSection) {
      commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
    }
  }
});

postsContainer.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target.closest('form[data-index]');
  if (!form) return;

  const index = Number(form.dataset.index);
  const input = form.querySelector('input[name="comment"]');
  const comment = input.value.trim();
  if (!comment) return;

  posts[index].comments.push(comment);
  input.value = '';
  renderPosts();
});

renderPosts();
