import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Tag, ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { blogPosts } from "@/data/blogData";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import NovaAssistant from "@/components/portfolio/NovaAssistant";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity">
            <ChevronLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              {post.category}
            </span>

            <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tighter mb-6 text-foreground leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime} read
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover image */}
      <div className="relative max-w-4xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border border-border"
        >
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </motion.div>
      </div>

      {/* Article content */}
      <article className="relative max-w-3xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="prose-blog"
        >
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const text = String(children).replace(/\n$/, "");
                if (!inline) {
                  return (
                    <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto my-4">
                      <code className="font-mono text-sm text-foreground" {...props}>{children}</code>
                    </pre>
                  );
                }
                return <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>
      </article>

      {/* Prev/Next navigation */}
      <section className="relative max-w-3xl mx-auto px-6 pb-32">
        <div className="border-t border-border pt-12">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center">
            Continue Reading
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {prevPost ? (
              <button
                onClick={() => navigate(`/blog/${prevPost.slug}`)}
                className="group glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all text-left"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <ArrowLeft className="w-3 h-3" />
                  Previous
                </div>
                <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {prevPost.title}
                </h4>
              </button>
            ) : (
              <div />
            )}
            {nextPost ? (
              <button
                onClick={() => navigate(`/blog/${nextPost.slug}`)}
                className="group glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all text-right"
              >
                <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mb-2">
                  Next
                  <ArrowRight className="w-3 h-3" />
                </div>
                <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {nextPost.title}
                </h4>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      <Footer />
      <NovaAssistant />
    </div>
  );
}