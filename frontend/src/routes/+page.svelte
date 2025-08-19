<script>
	import { BookOpen, Users, Building2 } from '@lucide/svelte';
</script>

<div class="min-h-[80vh] flex items-center justify-center">
	<div class="text-center space-y-8">
		<div class="space-y-4">
			<h1 class="text-6xl font-bold text-primary">📚</h1>
			<h2 class="text-4xl font-bold">Library Manager</h2>
			<p class="text-xl text-center text-base-content/70">
				Sistema de gestión para bibliotecas. Administra autores, libros y bibliotecas de
				manera fácil y eficiente.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
			<a
				href="/authors"
				class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
			>
				<div class="card-body items-center text-center">
					<Users size="48" class="text-primary mb-4" />
					<h3 class="card-title text-2xl">Autores</h3>
					<p class="text-base-content/70">
						Gestiona información de autores, sus biografías y obras
					</p>
				</div>
			</a>

			<a
				href="/books"
				class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
			>
				<div class="card-body items-center text-center">
					<BookOpen size="48" class="text-primary mb-4" />
					<h3 class="card-title text-2xl">Libros</h3>
					<p class="text-base-content/70">
						Administra el catálogo completo de libros y sus detalles
					</p>
				</div>
			</a>

			<a
				href="/libraries"
				class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
			>
				<div class="card-body items-center text-center">
					<Building2 size="48" class="text-primary mb-4" />
					<h3 class="card-title text-2xl">Bibliotecas</h3>
					<p class="text-base-content/70">
						Organiza bibliotecas y sus colecciones de libros
					</p>
				</div>
			</a>
		</div>
	</div>
</div>
