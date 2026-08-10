import { Icons } from "@/components/icons";
import { BookOpenIcon, CameraIcon, HomeIcon, PenLineIcon } from "lucide-react";
import type { ReactElement, SVGProps } from "react";
import { Cplusplus } from "@/components/ui/svgs/cplusplus";
import { EmbeddedSystems } from "@/components/ui/svgs/embeddedSystems";
import { Python } from "@/components/ui/svgs/python";
import { VerilogVhdl } from "@/components/ui/svgs/verilogVhdl";

type Skill = {
  name: string;
  /** Optional brand mark; skills without one render as a plain badge. */
  icon: ((props: SVGProps<SVGSVGElement>) => ReactElement) | null;
};

type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  /** Awards or notes shown as pills under the entry. */
  badges: string[];
  /** Empty string renders the entry as plain text instead of a link. */
  href: string;
};

const SKILLS: Skill[] = [
  { name: "RISC-V", icon: null },
  { name: "Computer Architecture", icon: null },
  { name: "Verilog", icon: VerilogVhdl },
  { name: "FPGA", icon: EmbeddedSystems },
  { name: "Python", icon: Python },
  { name: "C / OpenMP", icon: Cplusplus },
  { name: "Many-core SoC Integration", icon: null },
  { name: "Cache & Memory Subsystem", icon: null },
  { name: "AXI4 / NoC", icon: null },
  { name: "Performance Modeling", icon: null },
  { name: "HW/SW Co-design", icon: null },
  { name: "Synthesis & Timing", icon: null },
  { name: "Workload Profiling", icon: null },
  { name: "Linux / Git / LaTeX", icon: null },
];

const PUBLICATIONS: Publication[] = [
  {
    title:
      "MATANALYZE: A custom accelerator generator for sparse-dense and dense-sparse matrix multiplication",
    authors: "M. Sahel, M. R. Ashuthosh, and M. Purnaprajna",
    venue:
      "2025 IEEE 32nd International Conference on High Performance Computing, Data and Analytics Workshop (HiPCW), pp. 307-308",
    year: "2025",
    badges: ["Poster"],
    href: "",
  },
  {
    title:
      "PARISCV: A RISC-V profiler for application-specific hardware optimization",
    authors:
      "S. Spoorthi, M. R. Ashuthosh, K. Bharadhwaj, V. Reddy, and M. Purnaprajna",
    venue:
      "2025 IEEE 32nd International Conference on High Performance Computing, Data and Analytics Workshop (HiPCW), pp. 303-304",
    year: "2025",
    badges: ["Poster"],
    href: "",
  },
  {
    title:
      "Predicting the performance of graph algorithms on a RISC-V based multi-core processor cluster",
    authors: "M. R. Ashuthosh, A. Vinay, K. K. Nagar, and M. Purnaprajna",
    venue: "TECHCON 2024, Austin, TX, USA",
    year: "2024",
    badges: [],
    href: "",
  },
  {
    title:
      "PARISCV: A profiler for application-specific acceleration on RISC-V",
    authors: "M. R. Ashuthosh, J. Benitto, S. S., and M. Purnaprajna",
    venue:
      "3rd Workshop on Open-Source Computer Architecture Research (OSCAR), ISCA'24, Buenos Aires, Argentina",
    year: "2024",
    badges: ["Poster"],
    href: "https://ashuthosh.de/pariscv-site/",
  },
  {
    title: "Accelerating BFS algorithm on a RISC-V based many-core cluster",
    authors: "M. R. Ashuthosh, A. Vinay, K. K. Nagar, and M. Purnaprajna",
    venue: "HiPC Student Research Symposium (HiPC-SRS '23), Goa, India",
    year: "2023",
    badges: ["Poster", "Best Lightning Talk Award"],
    href: "",
  },
  {
    title:
      "Enabling high-level design strategies for high-throughput and low-power NB-LDPC decoders",
    authors:
      "S. Subramaniyan, O. Ferraz, M. R. Ashuthosh, S. Krishna, G. Wang, J. R. Cavallaro, V. Silva, G. Falcao, and M. Purnaprajna",
    venue: "IEEE Design & Test, vol. 40",
    year: "2022",
    badges: [],
    href: "",
  },
  {
    title:
      "MAPPARAT: A resource constrained FPGA-based accelerator for sparse-dense matrix multiplication",
    authors:
      "M. R. Ashuthosh, S. Krishna, V. Sudarshan, S. Subramaniyan, and M. Purnaprajna",
    venue:
      "35th International Conference on VLSI Design (VLSID), Bengaluru, India",
    year: "2022",
    badges: ["Best Paper Award"],
    href: "",
  },
  {
    title:
      "Pushing the limits of energy efficiency for non-binary LDPC decoders on GPUs and FPGAs",
    authors:
      "S. Subramaniyan, O. Ferraz, M. R. Ashuthosh, S. Krishna, G. Wang, J. R. Cavallaro, V. Silva, G. Falcao, and M. Purnaprajna",
    venue:
      "2020 IEEE Workshop on Signal Processing Systems (SiPS), pp. 1-6",
    year: "2020",
    badges: [],
    href: "",
  },
];

export const DATA = {
  name: "Ashuthosh M. R.",
  initials: "AMR",
  url: "https://ashuthosh.de",
  location: "Bengaluru, India",
  locationLink: "https://www.google.com/maps/place/bengaluru",
  description:
    "Senior Hardware Design Engineer at Calligo Technologies. I work on many-core RISC-V SoCs, computer architecture, and performance modeling for compute-intensive workloads.",
  summary:
    "I am a hardware design engineer and researcher working at the intersection of computer architecture, performance modeling, and hardware–software co-design.\n\nRight now I am integrating a multi-core RISC-V SoC for AI/ML acceleration — adapting an open-source many-core framework to production needs across interface specification, cache hierarchy, memory subsystem integration, and synthesis-ready design releases.\n\nBefore that I spent four years at the Centre for Heterogeneous and Intelligent Processing Systems (CHIPS) Lab, PES University, building analytical performance models, trace-driven profilers, and FPGA accelerators for sparse and dense linear algebra and graph workloads. I am particularly drawn to microarchitectural bottleneck analysis, memory hierarchy behaviour, and compute–memory trade-offs in many-core systems — and I genuinely enjoy working hands-on with FPGAs as experimental platforms to validate architectural ideas before silicon.\n\nOutside engineering, I explore photography as a way of observing structure, light, and perspective from a different lens.",
  avatarUrl: "/me.jpg",
  scholarUrl: "https://scholar.google.com/citations?user=PHT5rD8AAAAJ&hl=en",
  skills: SKILLS,
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: PenLineIcon, label: "Blog" },
    { href: "/bookshelf", icon: BookOpenIcon, label: "Bookshelf" },
    {
      href: "https://ashuthosh.de/foto",
      icon: CameraIcon,
      label: "Photography",
    },
  ],
  contact: {
    email: "ashuthoshmr25@gmail.com",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/ashuthosh-mr",
        icon: Icons.github,
        navbar: false,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/ashuthosh-mr",
        icon: Icons.linkedin,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "mailto:ashuthoshmr25@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Calligo Technologies",
      href: "https://calligotech.com/",
      badges: [],
      location: "Bengaluru, India",
      title: "Senior Hardware Design Engineer",
      logoUrl: "/logos/calligo.png",
      start: "Jan 2025",
      end: "Present",
      description:
        "• Drove platform selection for a multi-core RISC-V SoC targeting AI/ML acceleration, surveying open-source many-core frameworks and benchmarking projected core performance.\n• Specified and documented the core-to-cache interface, validating each transaction type against RTL waveforms and supporting an external team integrating a custom core.\n• Explored cache hierarchy configurations to improve cache performance while containing area.\n• Built out the memory subsystem and peripherals, including controller placement and a custom AXI4 peripheral.\n• Delivered periodic design releases and added automation scripts that simplified integration and simulation of the design.\n• Mentored an intern on a systolic-array matrix multiplier for DNN acceleration.",
    },
    {
      company:
        "Centre for Heterogeneous and Intelligent Processing Systems (CHIPS) Lab, PES University",
      href: "https://research.pes.edu/",
      badges: ["Research"],
      location: "Bengaluru, India",
      title: "Research Assistant",
      logoUrl: "/logos/chips.png",
      start: "Sep 2020",
      end: "Jan 2025",
      description:
        "• Designed FPGA-based accelerators for sparse-dense matrix multiplication, enabling high-throughput AI/ML kernel execution under resource constraints.\n• Developed an analytical performance model for RISC-V many-core architectures, enabling design-space exploration for graph-algorithm workloads.\n• Built a trace-driven profiler for RISC-V, identifying instruction-level extensions and application-specific accelerators to improve ML workload performance and efficiency.\n• Collaborated with the Semiconductor Research Corporation (SRC) on a funded project on domain-optimised RISC-V FPGA overlays.\n• Conducted RISC-V-on-FPGA lab sessions and mentored B.Tech students through processor-design and hardware-acceleration capstone projects.\n• Received the Best Lightning Talk Award at the HiPC Student Research Symposium 2023.",
    },
    {
      company: "Amrita Vishwa Vidyapeetham",
      href: "https://www.amrita.edu/",
      badges: ["Internship"],
      location: "Remote",
      title: "Research Assistant — Intern",
      logoUrl: "/logos/amrita.png",
      start: "Jan 2020",
      end: "May 2020",
      description:
        "Computer Architecture and High-Performance Lab.\n\n• Investigated robust GF(2^m) NB-LDPC decoders on FPGA against GPU implementations for throughput, power, and area, under the ECHO Indo-Portugal project.",
    },
  ],

  education: [
    {
      school: "PES University",
      href: "https://pes.edu/",
      degree: "M.Tech (by Research), Electronics and Communication Engineering",
      description:
        'Thesis: "Performance Prediction of Graph Algorithms on RISC-V Multi-Cores", advised by Prof. Madhura Purnaprajna. CGPA 8.14/10.',
      logoUrl: "/logos/pes.png",
      start: "May 2022",
      end: "Jul 2026",
    },
    {
      school: "PESIT — Bangalore South Campus",
      href: "https://pes.edu/",
      degree: "B.E., Electronics and Communication Engineering",
      description: "Graduated with 7.96/10 CGPA.",
      logoUrl: "/logos/pes.png",
      start: "Aug 2016",
      end: "Jul 2020",
    },
  ],

  projects: [
    {
      title: "PARISCV",
      href: "https://ashuthosh.de/pariscv-site/",
      dates: "2024",
      active: true,
      description:
        "A trace-driven profiler for RISC-V that identifies instruction-level extensions and application-specific accelerators to improve the performance and efficiency of ML workloads. By analysing execution traces, it surfaces the hotspots and instruction patterns that are the best candidates for custom hardware. Presented at OSCAR, ISCA'24.",
      technologies: [
        "RISC-V",
        "Python",
        "Trace Analysis",
        "Embench",
        "Workload Profiling",
      ],
      links: [
        {
          type: "Website",
          href: "https://ashuthosh.de/pariscv-site/",
          icon: <Icons.globe className="h-4 w-4" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Graph Algorithm Performance Model",
      href: "#",
      dates: "2022 - 2026",
      active: true,
      description:
        "An analytical performance model for RISC-V many-core architectures that enables design-space exploration for graph-algorithm workloads. Instead of relying on lengthy cycle-accurate simulation, the model predicts how graph workloads scale across cores, capturing the compute-memory trade-offs that shape performance on a multi-core cluster. Core of my M.Tech thesis; published at TECHCON 2024.",
      technologies: [
        "RISC-V",
        "Performance Modeling",
        "Graph Algorithms",
        "Many-core",
        "Python",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "MAPPARAT",
      href: "#",
      dates: "2022",
      active: false,
      description:
        "A resource-constrained FPGA accelerator for sparse-dense matrix multiplication, designed to deliver high-throughput AI/ML kernel execution under tight resource constraints. Explores dataflow and memory-access strategies that keep utilisation high when one operand is sparse and the other dense. Received the Best Paper Award at VLSID 2022.",
      technologies: [
        "FPGA",
        "Verilog",
        "Sparse GEMM",
        "Accelerator Design",
        "Best Paper",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "NB-LDPC Decoders on FPGA",
      href: "#",
      dates: "2020 - 2022",
      active: false,
      description:
        "An investigation of robust GF(2^m) non-binary LDPC decoders on FPGA, benchmarking throughput, power, and area against GPU implementations. Explored high-level design strategies for high-throughput, low-power decoding as part of the ECHO Indo-Portugal project. Design strategies published in IEEE Design & Test.",
      technologies: ["FPGA", "Verilog", "Error Correction", "Low Power"],
      links: [],
      image: "",
      video: "",
    },
  ],

  publications: PUBLICATIONS,

  volunteering: [
    {
      title:
        "Teaching & Mentoring — Centre for Heterogeneous and Intelligent Processing Systems (CHIPS) Lab, PES University",
      location: "Bengaluru, India",
      dates: "2020 - 2025",
      image: "/logos/chips.png",
      description:
        "Conducted RISC-V-on-FPGA lab sessions and mentored B.Tech students through processor-design and hardware-acceleration capstone projects.",
    },
    {
      title: "Intern Mentorship — Calligo Technologies",
      location: "Bengaluru, India",
      dates: "2025",
      image: "/logos/calligo.png",
      description:
        "Mentored an intern on the design and evaluation of a systolic-array matrix multiplier for DNN acceleration.",
    },
    {
      title: "SRC Collaboration — Domain-Optimised RISC-V FPGA Overlays",
      location: "Bengaluru, India",
      dates: "2022 - 2024",
      image: "/logos/src.png",
      description:
        "Collaborated with the Semiconductor Research Corporation (SRC) on a funded research project exploring domain-optimised RISC-V FPGA overlays.",
    },
  ],
};
