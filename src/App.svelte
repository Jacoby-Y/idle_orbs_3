<script>
  import { onMount } from "svelte/internal";
  import Main from "./comps/Main.svelte";
  import Canvas from "./comps/Canvas.svelte";

  //#region | Scale Game
  let main;
  const resize = ()=>{
    let scale = 1;
    const w = document.body.clientWidth;
    const h = document.body.clientHeight;
    if (w*0.5625 >= h) scale = h/900;
    else scale = w/1600;
    
    main.style.transform = `translate(-50%, -50%) scale(${scale}, ${scale})`;

    console.log("scaling!");
  }
  onMount(()=>{
		resize();
	});
	window.onresize = resize;
  //#endregion

</script>

<main bind:this={main}>
  <Main />
  <Canvas />
</main>

<style>
  main {
    width: 1600px;
    height: 900px;
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    background-color: #333;

    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 500px;
  }
</style>
