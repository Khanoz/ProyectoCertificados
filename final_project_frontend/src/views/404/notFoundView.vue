<template>
    <section
      class="flex flex-col items-center justify-center gap-2 md:gap-4 h-screen"
    >
      <h1 class="text-4xl md:text-6xl">
        ¿Está perdido 🤭?
      </h1>
      <p class="text-center">
        Le recomendamos volver al
        <RouterLink :to="{name: 'Landing'}" class="underline">inicio</RouterLink> y
        comenzar nuevamente.
      </p>
      <RouterLink :to="{name: 'Landing'}" class="p-2 bg-light text-dark rounded-full transition-all hover:scale-110">Volver al inicio</RouterLink>
    </section>
  </template>

  