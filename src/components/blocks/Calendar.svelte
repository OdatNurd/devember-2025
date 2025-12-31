<script lang="ts">
  import type { CalendarBlockProps } from '#components/blocks/Calendar.types';

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get props, populating in with today's year and month if the user foolishly
  // does not provide any.
  const today = new Date();
  let {
    name = 'Unnamed Course',
    year = $bindable(today.getFullYear()),
    month = $bindable(today.getMonth() + 1),
    markedDays = {},
    allowNav = false,

    sharedState,
  }: CalendarBlockProps = $props();

  // Capture the name of the month we were given; note that the date constructor
  // uses 0 based months because of course it does, but it uses 1 based year and
  // day, because of course it does.
  let monthName = $derived(new Date(year, month-1).toLocaleString('default', { month: 'long'}));
  let daysInMonth = $derived(new Date(year, month, 0).getDate());
  let startDayOfWeek = $derived(new Date(year, month-1, 1).getDay());

  // Determine if the calendar grid we're about to render matches the actual
  // month and year; if so we know we may need to handle one of the days
  // specially to mark it as today.
  let isCurrentMonthGrid = $derived(year === today.getFullYear() && month === (today.getMonth() + 1));

  // Get a set of cells that represent all of the days of the month. In order to
  // ease the display, this calculates the total number of elements needed to
  // fill out all of the weeks or partial weeks in the month, fills them with
  // null, and then only populates the ones that are actual days with the number
  // of the day.
  //
  // This allows us to identify grid elements that have no day attached to them.
  // The $derived.by makes the function re-execute every time the date changes.
  let calendarCells = $derived.by(() => {
    // Calculate the total number of weeks the calendar needs to cover; this
    // gives us a full week to start by using the starting day of the week in
    // this month as an offset and adding in the total number of days in the
    // month, and dividing by 7. From there we can extrapolate the total number
    // of cells, so that the grid is square.
    const totalWeeks = Math.ceil((startDayOfWeek + daysInMonth) / 7);

    // Allocate the cells and fill them with nulls. Once that is done we can
    // fill in all of the slots that refer to a day as the actual number;
    // anything left as a null will be rendered as an empty cell.
    const cells: (number | null)[] = new Array(totalWeeks * 7).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      cells[startDayOfWeek + i - 1] = i;
    }

    return cells;
  });

  // Change the current month by some number of months forward or backward. If
  // the month wraps around the end of the year, then the year changes too.
  function changeMonth(delta: number) {
    let newMonth = month + delta;
    if (newMonth > 12) {
      newMonth = 1;
      year++;
    } else if (newMonth < 1) {
      newMonth = 12;
      year--;
    }

    month = newMonth;
  }
</script>

<div class="calendar-container">
  {#if allowNav === true}
    <div class="nav">
      <button class="nav-button" onclick={() => changeMonth(-1)}> &lt; </button>
      <input  class="nav-input"  type="number" bind:value={year} />
      <button class="nav-button" onclick={() => changeMonth(+1)}> &gt; </button>
    </div>
  {/if}
  <div class="header">
    <div class="header-left">{year}</div>
    <div class="header-center">{name}</div>
    <div class="header-right">{monthName}</div>
  </div>

  <div class="grid">
    {#each weekdays as day (day)}
      <div class="day-name">{day}</div>
    {/each}

    {#each calendarCells as day, i (i)}
      <div
        class="day-cell"
        class:is-empty={day === null}
        class:is-today={isCurrentMonthGrid && day === today.getDate()}
      >
        <div class="day-number">{day ?? ''}</div>
        <div class="day-indicators">
          {#if day !== null && markedDays[year]?.[month]?.includes(day)}
            <div class="day-marker" style:background-color={sharedState.data.settings.myColorValue}></div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .calendar-container {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--text-accent);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    padding: 1.5rem 1rem 1rem 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: var(--background-secondary);
    border-bottom: 1px solid var(--background-modifier-border);
    font-size: 1.1em;
    font-weight: bold;
  }

  .header-left {
    flex: 1;
    text-align: left;
    color: var(--text-muted);
  }

  .header-center {
    flex: 2;
    text-align: center;
    color: var(--text-accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .header-right {
    flex: 1;
    text-align: right;
    color: var(--text-muted);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);
  }

  .day-name {
    background-color: var(--background-secondary);
    color: var(--text-muted);
    font-size: 0.85em;
    text-align: center;
    padding: 6px 0;
    font-weight: bold;
  }

  .day-cell {
    position: relative;
    background-color: var(--background-primary);
    min-height: 3rem;
    padding: 4px;
    font-size: 0.9em;
  }

  .day-cell.is-empty {
    background-color: var(--background-primary-alt);
  }

  .day-cell.is-today {
    background-color: var(--background-modifier-hover);
    color: var(--text-accent);
    font-weight: 900;
  }

  .day-number {
    text-align: right;
    position: relative;
    z-index: 2;
  }

  .day-indicators {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 1.8em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
  }

  .day-marker {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--text-accent);
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
  }

  .nav-button {
    border-radius: 4px;
    background-color: var(--interactive-normal);
    color: var(--text-accent);
    font-size: 1.1em;
    font-weight: bold;
  }

  .nav-input   {
    width: 4rem;
    text-align: center;
    border-radius: 4px;
    background-color: var(--interactive-normal);
    color: var(--text-accent);
    font-size: 1.1em;
    font-weight: bold;
  }

</style>