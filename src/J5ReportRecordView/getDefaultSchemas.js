import { round } from "lodash";

const getDefaultSchemas = (isGoldenGate, isGibson) => {
  return {
    j5PcrReactions: {
      fields: [
        { path: "id", type: "number", displayName: "PCR ID" },
        {
          path: "primaryTemplate.name",
          type: "string",
          displayName: "Template Name"
        },
        {
          path: "secondaryTemplate.name",
          type: "string",
          displayName: "Alternate Template Name"
        },
        {
          path: "forwardPrimer.id",
          type: "string",
          displayName: "Forward Oligo ID"
        },
        {
          path: "forwardPrimer.name",
          type: "string",
          displayName: "Forward Oligo Name"
        },
        {
          path: "reversePrimer.id",
          type: "string",
          displayName: "Reverse Oligo ID"
        },
        {
          path: "reversePrimer.name",
          type: "string",
          displayName: "Reverse Oligo Name"
        },
        { path: "note", type: "string", displayName: "Notes" },
        {
          path: "oligoMeanTm",
          type: "number",
          displayName: "Mean Tm (°C)",
          render: v => round(v, 2)
        },
        {
          path: "oligoDeltaTm",
          type: "number",
          displayName: "Delta Tm (°C)",
          render: v => round(v, 2)
        },
        {
          path: "oligoMeanTm3Prime",
          type: "number",
          displayName: "Mean Tm 3' (°C)",
          render: v => round(v, 2)
        },
        {
          path: "oligoDeltaTm3Prime",
          type: "number",
          displayName: "Delta Tm 3' (°C)",
          render: v => round(v, 2)
        },
        {
          path: "pcrProductSequence.size",
          type: "string",
          displayName: "Length (bp)"
        }
      ]
    },
    j5OligoSyntheses: {
      fields: [
        { path: "id", type: "string", displayName: "Oligo ID" },
        { path: "name", type: "string", displayName: "Oligo Name" },
        {
          path: "j5TargetParts",
          displayName: "Target Parts",
          render: (j5TargetParts = []) =>
            j5TargetParts
              .map(j5tp => j5tp.j5InputPart.sequencePart.name)
              .join(", ")
        },
        { path: "tm", type: "number", displayName: "Tm (°C)" },
        { path: "tm3Prime", type: "number", displayName: "Tm 3' Only (°C)" },
        {
          path: "oligo.sequence.size",
          type: "number",
          displayName: "Length (bp)"
        },
        {
          path: "cost",
          type: "number",
          displayName: "Cost (USD)"
        },
        {
          path: "oligo.sequence.polynucleotideMaterialId",
          type: "boolean",
          displayName: "Is Linked"
        }
      ]
    },
    j5AnnealedOligos: {
      fields: [
        { path: "id", type: "string", displayName: "Oligo ID" },
        { path: "name", type: "string", displayName: "Oligo Name" },
        {
          path: "targetPart",
          type: "string",
          displayName: "Target Part"
        },
        { path: "tm", type: "number", displayName: "Tm (°C)" },
        { path: "tm3Prime", type: "number", displayName: "Tm 3' Only (°C)" },
        {
          path: "oligo.sequence.size",
          type: "number",
          displayName: "Length (bp)"
        },
        {
          path: "cost",
          type: "number",
          displayName: "Cost (USD)"
        },
        {
          path: "oligo.sequence.polynucleotideMaterialId",
          type: "boolean",
          displayName: "Is Linked"
        }
      ]
    },
    j5AssemblyPieces: {
      fields: getJ5AssemblyPiecesFields(isGoldenGate, isGibson)
    },
    j5RunConstructs: {
      fields: [
        { path: "id", type: "string", displayName: "Construct ID" },
        { path: "name", type: "string", displayName: "Construct Name" },
        { path: "sequence.size", type: "number", displayName: "Length (bp)" },
        {
          path: "partsContainedNames",
          type: "string",
          displayName: "Parts Contained"
        }
      ]
    },
    j5InputSequences: {
      fields: [
        {
          path: "sequence.id",
          type: "string",
          displayName: "Sequence ID"
        },
        { path: "sequence.name", type: "string", displayName: "Name" },
        { path: "sequence.size", type: "number", displayName: "Length (bp)" },
        { path: "inStock", type: "boolean", displayName: "In Stock" },
        {
          path: "sequence.polynucleotideMaterialId",
          type: "boolean",
          displayName: "Is Linked"
        }
      ]
    },
    j5DirectSyntheses: {
      fields: [
        {
          path: "id",
          type: "string",
          displayName: "DNA Synthesis ID"
        },
        { path: "sequence.name", type: "string", displayName: "Name" },
        { path: "inStock", type: "boolean", displayName: "In Stock" },
        {
          path: "sequence.polynucleotideMaterialId",
          type: "boolean",
          displayName: "Is Linked"
        },
        { path: "sequence.size", type: "number", displayName: "Length (bp)" },
        { path: "cost", type: "number", displayName: "Cost (USD)" }
      ]
    },
    j5InputParts: {
      fields: [
        {
          path: "sequencePart.id",
          type: "string",
          displayName: "Part ID"
        },
        { path: "sequencePart.name", type: "string", displayName: "Part Name" },
        {
          path: "sequencePart.sequence.name",
          type: "string",
          displayName: "Source"
        },
        {
          path: "sequencePart.strand",
          type: "number",
          displayName: "Reverse Complement",
          render: v => (v === 1 ? "False" : "True")
        },
        {
          path: "sequencePart.start",
          type: "number",
          displayName: "Start (bp)",
          render: n => n + 1
        },
        {
          path: "sequencePart.end",
          type: "number",
          displayName: "End (bp)",
          render: n => n + 1
        },
        { path: "size", type: "number", displayName: "Length (bp)" }
      ]
    }
  };
};

const getJ5AssemblyPiecesFields = (isGoldenGate, isGibson) => [
  { path: "id", type: "string", displayName: "Piece ID" },
  { path: "name", type: "string", displayName: "Name" },
  { path: "type", type: "string", displayName: "Source" },
  {
    path: "j5AssemblyPieceParts",
    displayName: "Parts Contained",
    render: (j5AssemblyPieceParts = []) =>
      j5AssemblyPieceParts
        .sort((a, b) => a.index - b.index)
        .map(piecePart => piecePart.j5InputPart.sequencePart.name)
        .join(", ")
  },
  ...getOverhangFields(isGoldenGate, isGibson),
  {
    path: "sequence.polynucleotideMaterialId",
    type: "boolean",
    displayName: "Is Linked"
  },
  { path: "sequence.size", type: "number", displayName: "Length (bp)" },
  ...getExtraBpsFields(isGibson)
];

/**
 * Get the fields to add to the assembly piece schema to show the information
 * about the overhangs/overlaps.
 */
const getOverhangFields = (isGoldenGate, isGibson) => {
  if (!isGoldenGate && !isGibson) return [];
  const over = isGoldenGate ? "Overhang" : "Overlap";
  return [
    isGoldenGate && {
      path: "overhangWithPrevious",
      type: "string",
      displayName: `${over} w/ Previous`
    },
    isGoldenGate && {
      path: "overhangWithPrevious",
      type: "number",
      displayName: `${over} w/ Previous Length`,
      render: over => (over ? over.length : "n/a")
    },
    {
      path: "overhangWithNext",
      type: "string",
      displayName: `${over} w/ Next`
    },
    {
      path: "overhangWithNext",
      type: "number",
      width: 100,
      displayName: `${over} w/ Next Length`,
      render: over => (over ? over.length : "n/a")
    },
    {
      path: "relativeOverhang",
      type: "number",
      displayName: `Relative ${over} Position`
    }
  ].filter(x => x);
};

const getExtraBpsFields = isGibson =>
  isGibson
    ? [
        {
          path: "extra5PrimeCpecBps",
          displayName: "Extra 5' Bps"
        },
        {
          path: "extra3PrimeCpecBps",
          displayName: "Extra 3' Bps"
        }
      ]
    : [];

export default getDefaultSchemas;
