// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "publications in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Selected research and engineering projects in computer architecture, RISC-V systems, and FPGA acceleration.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Curriculum vitae of Ashuthosh M. R.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Open-source work and GitHub activity.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-photography",
          title: "photography",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/https:/ashuthosh.de/foto/";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "news-mapparat-received-the-best-paper-award-at-the-35th-international-conference-on-vlsi-design-vlsid-2022",
          title: 'MAPPARAT received the Best Paper Award at the 35th International Conference on VLSI...',
          description: "",
          section: "News",},{id: "news-received-the-best-lightning-talk-award-at-the-hipc-student-research-symposium-2023",
          title: 'Received the Best Lightning Talk Award at the HiPC Student Research Symposium 2023....',
          description: "",
          section: "News",},{id: "news-presented-pariscv-a-profiler-for-application-specific-acceleration-on-risc-v-at-the-3rd-workshop-on-open-source-computer-architecture-research-oscar-isca-24-buenos-aires-project-page",
          title: 'Presented PARISCV, a profiler for application-specific acceleration on RISC-V, at the 3rd Workshop...',
          description: "",
          section: "News",},{id: "news-joined-calligo-technologies-as-a-senior-hardware-design-engineer-working-on-a-risc-v-multicore-processor-with-posit-low-mixed-precision-arithmetic-for-ai-ml-acceleration",
          title: 'Joined Calligo Technologies as a Senior Hardware Design Engineer, working on a RISC-V...',
          description: "",
          section: "News",},{id: "projects-mapparat",
          title: 'MAPPARAT',
          description: "A resource-constrained FPGA accelerator for sparse-dense matrix multiplication.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_mapparat/";
            },},{id: "projects-pariscv",
          title: 'PARISCV',
          description: "A trace-driven profiler for application-specific acceleration on RISC-V.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_pariscv/";
            },},{id: "projects-graph-algorithm-performance-model",
          title: 'Graph Algorithm Performance Model',
          description: "An analytical performance model for graph algorithms on RISC-V multi-core clusters.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_graph-perf-model/";
            },},{id: "projects-nb-ldpc-decoders-on-fpga",
          title: 'NB-LDPC Decoders on FPGA',
          description: "High-throughput, low-power non-binary LDPC decoders over GF(2^m).",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_nb-ldpc/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%61%73%68%75%74%68%6F%73%68%6D%72%32%35@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/ashuthosh-mr", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/ashuthosh-mr", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=PHT5rD8AAAAJ", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
