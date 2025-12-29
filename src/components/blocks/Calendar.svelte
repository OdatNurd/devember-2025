<script lang="ts">
  import type { CalendarBlockProps } from '#components/blocks/Calendar.types';

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let {
    year = 2025,
    month = 12,
    name = 'Test Calendar',

    // sharedState,
  }: CalendarBlockProps = $props();

  // Capture the name of the month we were given; note that the date constructor
  // uses 0 based months because of course it does, but it uses 1 based year and
  // day, because of course it does.
  let monthName = $derived(new Date(year, month-1).toLocaleString('default', { month: 'long'}));
  let daysInMonth = $derived(new Date(year, month, 0).getDate());
  let startDayOfWeek = $derived(new Date(year, month-1, 1).getDay());

  // Get a set of cells that represent all of the days of the month. In order to
  // ease the display of things, this starts the array with some number of
  // entries that contain null, which indicates days from the previous month
  // (e.g. if the month starts on a Monday, the first entry is null). The
  // $derived.by makes the function re-execute every time the date changes.
  let calendarCells = $derived.by(() => {
    const cells: (number | null)[] = [];

    // Include the adding elements for the days at the start of the calendar
    // that are for the previous month.
    for (let i = 0 ; i < startDayOfWeek ; i++) {
      cells.push(null);
    }

    // Insert the cells for the actual days now.
    for (let i = 1 ; i <= daysInMonth ; i++) {
      cells.push(i);
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  });

  // console.log(monthName, daysInMonth, startDayOfWeek);
  // console.log(calenderCells);
</script>

<div class="calendar-container">
  <div class="header">
    <div class="header-left">{year}</div>
    <div class="header-center">{name}</div>
    <div class="header-right">{monthName}</div>
  </div>

  <div class="grid">
    {#each weekdays as day (day)}
      <div class="day-name">{day}</div>
    {/each}

    {#each calendarCells as day (day)}
      <div class="day-cell" class:is-empty={day === null}>
        {day ?? ''}
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
    background-color: var(--background-primary);
    min-height: 3rem;
    padding: 4px;
    text-align: right;
    font-size: 0.9em;
  }

  .day-cell.is-empty {
    background-color: var(--background-primary-alt);
  }

</style>