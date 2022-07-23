<script>
	import { RenderModes, render_mode } from "../store";
	
	const modes = {};
	Object.values(RenderModes).forEach(key => {
		modes[key] = ()=>{
			$render_mode = key;
		}
	});
	
	$: mode_count = Object.values(RenderModes).length;

</script>

<div id="render-wrapper" style="grid-template-columns: 1fr repeat({mode_count}, max-content);">
	<h4>Render Mode</h4>
	{#each Object.entries(modes) as [mode, func]}
		<button class:selected={mode == $render_mode} on:click={func}> <b>&lt;</b> {mode} <b>&gt;</b> </button>
	{/each}
</div>

<style>
	#render-wrapper {
		background-color: inherit;
		color: #00d696;
		border: 1px solid #00d696;
		font-size: 1.2rem;
		width: 100%;
		font-weight: bold;
		display: grid;
		align-items: center;
		justify-items: center;
		text-align: center;
	}
	#render-wrapper button {
		border: none;
		border-left: inherit;
	}
	button:not(.selected) b {
		opacity: 0;
	}
	button.selected b {
		opacity: 1;
	}
</style>