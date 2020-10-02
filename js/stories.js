// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}
$storyForm.on("submit", addStory);

async function addStory(evt) {
   evt.preventDefault();

   await storyList.addStory(currentUser, 
   {title: $("#title").val(), author: $("#author").val(), url: $("#url").val()});

   putStoriesOnPage();
   $storyForm.trigger("reset");
   $storyForm.hide();

}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let classy = `far fa-thumbs-up`;

  if (currentUser.favorites.includes(story.storyID)) {
    classy = "fas fa-thumbs-up";
  }
  
  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        <i class="${classy}"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
function createFavsDom() {
  let favy = currentUser.favorites;
  let newDiv =$("<div>");

  for (let fav of favy) {
    newDiv.append(`<li id="${fav.storyId}">
    <a href="${fav.url}" target="a_blank" class="story-link">
      ${fav.title}
    </a>
    <small class="story-author">by ${fav.author}</small>
    <small class="story-user">posted by ${fav.username}</small>
    </li>`)
  }

  return newDiv; 
}

$("body").on("click", "i", function (evt) {
  $(evt.target).toggleClass("far fas"); 
  $("#fav-cont").append(createFavsDom()) 
})

let count = 0
$(".favs").on("click", function(evt) {
  $("#fav-cont").toggle()
  count++
  if (count % 2 === 1) {
    hidePageComponents();
  } else {
    putStoriesOnPage();
  }
  
  
  
  
  // $("#all-stories-list").append()
  // console.log("currrfaaav",currentUser.favorites);
})
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
