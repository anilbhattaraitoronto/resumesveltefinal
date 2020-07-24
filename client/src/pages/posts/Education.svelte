<script>
  import { education } from "../../stores/postStore.js";
</script>

<style>
  .post-container {
    height: 100%;
    overflow: auto;
    padding: 8px;
    margin: auto;
    width: 98%;
  }
</style>

<main class="post-container">
  <h2 class="page-title">Educational Qualifications</h2>
  <div class="">
    {#if $education.length > 0}
      {#each $education as item}
        <div class="post">
          <p>{item.category}</p>
          <h3 class="post-title">{item.title}</h3>
          <div class="post-content">
            {@html item.content}
          </div>
          <p>Tags: {item.tags}</p>
          <p>Posted on: {item.posted_date}</p>
          <p />
        </div>
      {/each}
    {:else}
      <p>There is no education post yet.</p>
    {/if}
  </div>
</main>
