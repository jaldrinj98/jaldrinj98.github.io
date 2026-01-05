// 🔑 SUPABASE CONFIG
const SUPABASE_URL = "https://eyozkgejcswayxqpjmeg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_h3X2cg3763Os0T-s9G7cvQ_VmitJMKm";

// ✅ use a DIFFERENT name
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let currentUser = null;


content?.addEventListener("input", () => {
  charCount.innerText = content.value.length + " / 280";
});

async function signUp() {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { username: username.value }
    }
  });
}

async function signIn() {
  await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
}

async function signOut() {
  await supabase.auth.signOut();
}

supabase.auth.onAuthStateChange((_event, session) => {
  currentUser = session?.user || null;
  document.getElementById("postBox").style.display =
    session ? "block" : "none";
});

async function createPost() {
  if (!content.value) return;

  await supabase.from("posts").insert({
    content: content.value,
    username: currentUser.user_metadata.username
  });

  content.value = "";
  charCount.innerText = "0 / 280";
}

function renderPost(p, isAdmin) {
  return `
    <div class="post">
      <div class="meta">
        @${p.username} · ${new Date(p.created_at).toLocaleString()}
        ${isAdmin ? `<span class="delete" onclick="deletePost(${p.id})">delete</span>` : ""}
      </div>
      ${p.content}
    </div>
  `;
}

async function deletePost(id) {
  await supabase.from("posts").delete().eq("id", id);
}

supabase
  .channel("posts-live")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "posts" },
    payload => loadPosts()
  )
  .subscribe();

async function loadPosts() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const isAdmin = currentUser?.role === "authenticated";

  posts.innerHTML = "";
  data.forEach(p => {
    posts.innerHTML += renderPost(p, isAdmin);
  });
}

loadPosts();
