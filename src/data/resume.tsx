import { Icons } from "@/components/icons";
import { BookOpenIcon, HomeIcon, CameraIcon } from "lucide-react";
import { Cplusplus } from "@/components/ui/svgs/cplusplus";
import { Docker } from "@/components/ui/svgs/docker";
import { EmbeddedSystems } from "@/components/ui/svgs/embeddedSystems";
import { Python } from "@/components/ui/svgs/python";
import { VerilogVhdl } from "@/components/ui/svgs/verilogVhdl";

export const DATA = {
  name: "Ashuthosh M. R.",
  initials: "AMR",
  url: "https://ashuthosh.de",
  location: "Bengaluru, India",
  locationLink: "https://www.google.com/maps/place/bengaluru",
  description:
    "Computer Architecture & RISC-V Engineer. Designing performance-aware digital systems from FPGA prototypes to scalable architectures.",
  summary:
    "Hardware design engineer working across many-core SoC integration, computer architecture, and performance modeling for compute-intensive workloads. Published research background in performance modeling, workload profiling, and FPGA accelerators for AI kernels.",
  avatarUrl: "/me.jpg",
  skills: [
    { name: "Python", icon: Python },
    { name: "C/C++", icon: Cplusplus },
    { name: "Docker", icon: Docker },
    { name: "Verilog", icon: VerilogVhdl },
    { name: "Embedded Systems", icon: EmbeddedSystems },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "https://ashuthosh.de/foto", icon: CameraIcon, label: "Photography" },
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
      href: "#",
      badges: [],
      location: "Bengaluru, India",
      title: "Senior Hardware Design Engineer",
      logoUrl: "",
      start: "Jan 2025",
      end: "Present",
      description:
        "Drove platform selection for a multi-core RISC-V SoC targeting AI/ML acceleration. Specified and documented the core-to-cache interface, explored cache hierarchy configurations, built out memory subsystem, and delivered periodic design releases with automation scripts.",
    },
    {
      company: "CHIPS, PES University",
      href: "#",
      badges: ["Research"],
      location: "Bengaluru, India",
      title: "Research Assistant",
      logoUrl: "",
      start: "Sep 2020",
      end: "Jan 2025",
      description:
        "Designed FPGA-based accelerators for sparse-dense matrix multiplication. Developed an analytical performance model for RISC-V many-core architectures. Built a trace-driven profiler for RISC-V and collaborated with SRC on domain-optimised RISC-V FPGA overlays.",
    },
    {
      company: "Amrita Vishwa Vidyapeetham",
      href: "#",
      badges: ["Internship"],
      location: "Remote",
      title: "Research Assistant (Intern)",
      logoUrl: "",
      start: "Jan 2020",
      end: "May 2020",
      description:
        "Investigated robust GF(2^m) NB-LDPC decoders on FPGA, benchmarking throughput, power, and area against GPU implementations.",
    },
  ],

  education: [
    {
      school: "PES University",
      href: "#",
      degree: "M.Tech (by Research) in Electronics and Communication Engineering",
      logoUrl: "",
      start: "May 2022",
      end: "Jul 2026",
    },
    {
      school: "PESIT - Bangalore South Campus",
      href: "#",
      degree: "B.E. in Electronics and Communication Engineering",
      logoUrl: "",
      start: "Aug 2016",
      end: "Jul 2020",
    },
  ],

  projects: [
    {
      title: "Performance Prediction of Graph Algorithms on RISC-V Multi-Cores",
      href: "https://ashuthosh.de/pariscv",
      dates: "2022 - 2026",
      active: true,
      description:
        "Developed analytical models and trace-driven profilers to evaluate the performance of graph workloads on RISC-V many-core systems.",
      technologies: [
        "RISC-V",
        "Performance Modeling",
        "C++",
        "Python",
      ],
      links: [
        {
          type: "Website",
          href: "https://ashuthosh.de/pariscv",
          icon: <Icons.globe className="h-4 w-4" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "MAPPARAT",
      href: "#",
      dates: "2022",
      active: true,
      description:
        "A resource constrained FPGA-based accelerator for sparse-dense matrix multiplication. Received Best Paper Award at VLSID 2022.",
      technologies: [
        "FPGA",
        "Verilog",
        "Hardware Acceleration",
      ],
      links: [],
      image: "",
      video: "",
    }
  ],
};
