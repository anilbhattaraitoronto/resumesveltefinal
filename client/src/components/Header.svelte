<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let pageTabs;
  export let activeTab;
</script>

<style>
  main {
    background: rgb(0, 100, 200);
    padding: 8px;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: auto;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.24);
    padding: 4px 16px;
    letter-spacing: 1px;
  }
  a {
    color: white;
    font-weight: 100;
  }
  nav {
    display: flex;
    justify-content: end;
    align-items: center;
    flex-wrap: wrap;
  }
  nav > button {
    all: unset;
    padding: 0 8px;
    border-right: 1px solid rgba(255, 255, 255, 0.404);
    cursor: pointer;
    font-size: 14px;
    color: white;
    font-weight: 100;
  }
  nav > button:hover,
  .active {
    text-decoration: underline;
    color: rgba(247, 231, 7, 0.925);
  }
</style>

<main>
  <header>
    <h1>
      <a href="/">Résumé</a>
    </h1>
    <nav>
      {#each pageTabs as item}
        <button
          on:click={() => dispatch('tabChange', item)}
          class:active={item === activeTab}>
          {item}
        </button>
      {/each}
    </nav>
  </header>
</main>
