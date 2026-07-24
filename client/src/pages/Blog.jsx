import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Calendar, ArrowRight, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { blogPosts, blogCategories, allBlogTags } from "@/data/blogData";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import NovaAssistant from "@/components/portfolio/NovaAssistant";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeTag, setActiveTag] = useState(null);
  const navigate = useNavigate();

  const filtered = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || post.category === category;
    const matchesTag = !activeTag || post.tags.includes(activeTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-secondary/5 dark:bg-secondary/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wider uppercase mb-6">
              Engineering Notes
            </span>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-6 text-foreground leading-[1.05]">
              The <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-[1.7] font-medium">
              Deep dives into project development, technical challenges, debugging journeys, and lessons learned from building AI and full-stack applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="relative max-w-7xl mx-auto px-6 mb-12">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                category === cat
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              !activeTag ? "bg-primary/10 text-primary border border-primary/20" : "bg-card text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            All Tags
          </button>
          {allBlogTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTag === tag ? "bg-primary/10 text-primary border border-primary/20" : "bg-card text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Blog grid */}
      <section className="relative max-w-7xl mx-auto px-6 pb-32">
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group glass rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              >
                {/* Cover image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.cover}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-background/80 text-primary border border-primary/20 backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>

                  <h2 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-2">No articles found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); setActiveTag(null); }}
              className="mt-4 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      <Footer />
      <NovaAssistant />
    </div>
  );
}