<script lang="ts">
	import type { TourData } from '../types/TourData';
	export let data: TourData;
	export let eventHandlers: { close: () => void; next: () => void; previous: () => void };
	export let progress;
	export let theme: 'light' | 'dark' = 'light';

	/*
let arrowCSS = orientation => {
  const COLOR = 'grey'

  switch (orientation) {
    case 'bottom':
      return `
            width: 0; 
            height: 0; 
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid ${COLOR};
          `;
    case 'top':
      return `
            width: 0; 
            height: 0; 
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 20px solid ${COLOR};
          `;

    case 'left':
      return `
            width: 0; 
            height: 0; 
            border-top: 60px solid transparent;
            border-bottom: 60px solid transparent;
            border-left: 60px solid ${COLOR};
          `;

    case 'right':
      return `
            width: 0; 
            height: 0; 
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent; 
            
            border-right:10px solid ${COLOR}; 
          `;
  }
};*/
</script>

<div
	id="tour_modal"
	class="boxCSS rounded-[0.65rem] {theme === 'dark' ? 'bg-slate-900 text-white' : ''}"
>
	<button class="closeButtonCSS" on:click={eventHandlers.close}>x</button>
	<h3 style="font-weight:bold">{data.title ?? ''}</h3>
	<div>{data.content}</div>
	<div
		class="controls"
		style="overflow: hidden; padding: 10px; display:{progress.total === 1 ? 'none' : 'block'}"
	>
		<span class="progress" style="float: left">
			<div>{progress.current}/{progress.total}</div>
		</span>
		<span class="actions" style="float: right">
			{#if progress.current > 1}
				<button on:click={eventHandlers.previous}>Previous</button>
			{/if}
			<button on:click={eventHandlers.next}
				>{progress.total - progress.current === 0 ? 'Close' : 'Next'}</button
			>
		</span>
	</div>
</div>

<style>
	.rounded-\[0\.65rem\] {
		border-radius: 0.65rem /* 10.4px */;
	}
	.bg-slate-900 {
		--tw-bg-opacity: 1;
		background-color: rgb(15 23 42 / var(--tw-bg-opacity)) !important /* #0f172a */;
	}
	.text-white {
		--tw-text-opacity: 1;
		color: rgb(255 255 255 / var(--tw-text-opacity)) !important /* #ffffff */;
	}
	.boxCSS {
		background-color: white;
		color: black;
		padding: 15px;
		box-shadow: 0px 0px 9px #636363;
		max-width: 300px;
		min-width: 200px;
	}
	.closeButtonCSS {
		float: right;
		position: relative;
		cursor: pointer;
		top: -5px;
		padding: 5px;
		color: #aaa;
	}
</style>
