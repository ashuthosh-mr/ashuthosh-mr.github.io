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
    authors: "M. R. Ashuthosh, J. Benitto, S. Spoorthi, and M. Purnaprajna",
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
    "I am a hardware design engineer working across computer architecture, performance modeling, and hardware-software co-design.\n\nAt Calligo Technologies I am integrating a multi-core RISC-V SoC for AI/ML acceleration. Before that, four years at the CHIPS Lab, PES University, building performance models, trace-driven profilers, and FPGA accelerators for RISC-V and FPGA platforms.\n\nOutside engineering, I explore photography.",
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
      dates: "2024 - Present",
      active: true,
      description:
        "A trace-driven profiler for RISC-V that analyses execution traces to recommend which ISA extensions and custom sub-instructions are actually worth putting in hardware. It reports cycle counts and instruction mix per extension across the Embench suite, so a speed-up can be weighed against the area and power an extension would cost. Presented as a poster at OSCAR (ISCA'24) and at HiPCW 2025.",
      technologies: [
        "RISC-V",
        "Python",
        "Trace Analysis",
        "Embench",
        "ISA Extensions",
      ],
      links: [
        {
          type: "Website",
          href: "https://ashuthosh.de/pariscv-site/",
          icon: <Icons.globe className="h-4 w-4" />,
        },
        {
          type: "GitHub",
          href: "https://github.com/ashuthosh-mr/profiler",
          icon: <Icons.github className="h-4 w-4" />,
        },
      ],
      image: "",
      video: "/project/pariscv.mp4",
    },
    {
      title: "Ginger-V",
      href: "https://github.com/ashuthosh-mr/ginger-v",
      dates: "2026 - Present",
      active: true,
      description:
        "A ParaGato Labs project on architecture- and memory-centric design space exploration for DNN-based genomic basecalling on heterogeneous RISC-V systems at the edge. Nanopore basecallers normally lean on GPUs to keep pace with sequencing rates; Ginger-V asks when an FPGA-backed RISC-V platform can sustain them instead, under real power and memory budgets. GEMM-dominant kernels are offloaded to RedMulE, the PULP platform's outer-product systolic GEMM accelerator, while control, activations and decoding stay on the RISC-V host with selective custom instructions. The study centres on memory traffic and data movement, tiling and reuse, arithmetic intensity, and real-time feasibility against nanopore signal rates.",
      technologies: [
        "RISC-V",
        "Genomic Basecalling",
        "DNN Inference",
        "RedMulE",
        "PULP",
        "Memory Analysis",
      ],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/ashuthosh-mr/ginger-v",
          icon: <Icons.github className="h-4 w-4" />,
        },
      ],
      // The logo doubles as the video's poster frame.
      image: "/project/ginger-v.png",
      video: "/project/ginger-v.mp4",
    },
    {
      title: "MAPPARAT",
      href: "https://github.com/santoshkrishna4138/Sparse_Dense_Matrix_Multiplication",
      dates: "2021 - 2022",
      active: false,
      description:
        "A resource-constrained FPGA accelerator for sparse-dense matrix multiplication, implemented for 560x560 matrices. It explores the dataflow and memory-access strategies that keep utilisation high when one operand is sparse and the other dense, so high-throughput AI/ML kernels still fit on modest FPGA fabric. Received the Best Paper Award at VLSID 2022.",
      technologies: [
        "FPGA",
        "Verilog",
        "Sparse GEMM",
        "Accelerator Design",
        "Best Paper",
      ],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/santoshkrishna4138/Sparse_Dense_Matrix_Multiplication",
          icon: <Icons.github className="h-4 w-4" />,
        },
      ],
      image: "",
      video: "/project/mapparat.mp4",
    },
    {
      title: "RISC-V on FPGA Labs",
      href: "https://github.com/ashuthosh-mr/RISC-V-On-FPGA-Labs",
      dates: "2022",
      active: false,
      description:
        "Course material I built and taught for undergraduate electronics students at the CHIPS Lab, PES University. It ships Vivado project files for the Pinaka SoC - a 32-bit Shakti RISC-V core targeting Arty A7-35 and A7-100 boards - alongside labs that take students from running C on the Spike simulator and measuring cycle counts, through programming the board, to designing and packaging their own custom AXI4 peripheral and running code against it.",
      technologies: [
        "RISC-V",
        "Shakti",
        "Vivado",
        "Bluespec",
        "AXI4",
        "Teaching",
      ],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/ashuthosh-mr/RISC-V-On-FPGA-Labs",
          icon: <Icons.github className="h-4 w-4" />,
        },
      ],
      image: "",
      video: "/project/riscv-labs.mp4",
    },
    {
      title: "LDPC Decoder RTL",
      href: "https://github.com/ashuthosh-mr/LDPC-RTL",
      dates: "2020 - 2022",
      active: false,
      description:
        "RTL implementations of non-binary LDPC decoders over GF(4), GF(8) and GF(16). Part of the NB-LDPC work benchmarking FPGA decoders against GPU implementations for throughput, power and area, carried out under the ECHO Indo-Portugal project and published at SiPS 2020 and in IEEE Design & Test.",
      technologies: ["Verilog", "FPGA", "Error Correction", "Low Power"],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/ashuthosh-mr/LDPC-RTL",
          icon: <Icons.github className="h-4 w-4" />,
        },
      ],
      image: "",
      video: "/project/ldpc.mp4",
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
