<script>
	import { page } from '$app/stores';
	import { BookOpen, Users, Building2 } from '@lucide/svelte';
</script>

<nav class="navbar bg-base-200 shadow-lg">
	<div class="navbar-start flex-1">
		<a href="/" class="btn btn-ghost text-xl"> 📚 Library Manager </a>
	</div>

	<div class="navbar-end flex-1 justify-end">
		<div class="menu menu-horizontal p-0">
			<li>
				<a
					href="/authors"
					class="btn btn-ghost"
					class:btn-active={$page.url.pathname.startsWith('/authors')}
				>
					<Users size="20" />
					Autores
				</a>
			</li>
			<li>
				<a
					href="/books"
					class="btn btn-ghost"
					class:btn-active={$page.url.pathname.startsWith('/books')}
				>
					<BookOpen size="20" />
					Libros
				</a>
			</li>
			<li>
				<a
					href="/libraries"
					class="btn btn-ghost"
					class:btn-active={$page.url.pathname.startsWith('/libraries')}
				>
					<Building2 size="20" />
					Bibliotecas
				</a>
			</li>
		</div>
	</div>
</nav>
