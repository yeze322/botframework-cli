@microsoft/bf-orchestrator-cli
======================

This package is a plugin for @microsoft/botframework-cli. It is not designed to be consumed as an independent package.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@microsoft/bf-luis-cli.svg)](https://npmjs.org/package/@microsoft/bf-luis-cli)

Orchestrator CLI is a replacement of the [Dispatch CLI](https://github.com/microsoft/botbuilder-tools/tree/master/packages/Dispatch). Create and evaluate Orchestrator model used to arbitrate across multiple bot modules such as LUIS models, QnA knowledge bases and others.

## Prerequisite

- [Node.js](https://nodejs.org/) version 10.14.1 or higher
- @microsoft/botframework-cli
```
$ npm install -g @microsoft/botframework-cli
```
- For installation on Linux Ubuntu LTS, run the following after bf plugin install (see installation below):
```
sudo apt-get -y install libicu-dev
cd <$(npm root -g)/@microsoft/botframework-cli/node_modules/orchestrator-core>
ln -s libicudata.so /usr/lib/x86_64-linux-gnu/libicudata.so.60  
ln -s libicuuc.so /usr/lib/x86_64-linux-gnu/libicuuc.so.60
ln -s libicui18n.so /usr/lib/x86_64-linux-gnu/libicu18n.so.60
curl -LO -C - https://github.com/microsoft/onnxruntime/releases/download/v1.2.0/onnxruntime-linux-x64-1.2.0.tgz
tar xvzf onnxruntime-linux-x64-1.2.0.tgz
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$(pwd):$(pwd)/onnxruntime-linux-x64-1.2.0/lib
```
- For installation on Mac:
```
brew install icu4c
```

## Installation
To install the bf-orchestrator-cli plugin:

```
bf plugins:install @microsoft/bf-orchestrator-cli@beta
```

To uninstall the bf-orchestrator-cli plugin, a step for upgrading the plugin:

```
bf plugins:unstall @microsoft/bf-orchestrator-cli
```

# Commands

<!-- commands -->

* [`bf orchestrator`](#bf-orchestrator)
* [`bf orchestrator:add`](#bf-orchestratoradd)
* [`bf orchestrator:assess`](#bf-orchestratorassess)
* [`bf orchestrator:create`](#bf-orchestratorcreate)
* [`bf orchestrator:build`](#bf-orchestratorbuild)
* [`bf orchestrator:evaluate`](#bf-orchestratorevaluate)
* [`bf orchestrator:nlr:get`](#bf-orchestratornlrget)
* [`bf orchestrator:nlr:list`](#bf-orchestratornlrlist)
* [`bf orchestrator:predict`](#bf-orchestratorpredict)
* [`bf orchestrator:test`](#bf-orchestratortest)

## `bf orchestrator`

Display Orchestrator CLI available commands

```
USAGE
  $ bf orchestrator

OPTIONS
  -h, --help  Orchestrator commands help
```

_See code: [src\commands\orchestrator\index.ts]https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/index.ts)_


## `bf orchestrator:add`

Add examples from .lu/.qna/.json/.blu files to existing Orchestrator snapshot file.

```
USAGE
  $ bf orchestrator:add

OPTIONS
  -d, --debug
  -f, --force              If --out flag is provided with the path to an existing file, overwrites that file
  -h, --help               Orchestrator add command help
  -i, --in=in              Path to example file (.lu/.qna/.json/.tsv/.blu).
  -m, --model=model        Path to Orchestrator model directory.
  -o, --out=out            Path where generated Orchestrator example file will be placed. Default to current working directory
  -p, --prefix=prefix      Prefix to be added to label in snapshot
  -s, --snapshot=snapshot  Existing Orchestrator snapshot to append to
  --dialog                 Generate multi language or cross train Orchestrator recognizers.

EXAMPLE
       $ bf orchestrator:add 
       $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/
       $ bf orchestrator:add --in ./path/to/file/ --snapshot ./path/to/snapshot/ --out ./path/to/output/
       $ bf orchestrator:add --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory
```

_See code: [src\commands\orchestrator\add.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/add.ts)_


## `bf orchestrator:assess`

Create an evaluation report on assessing prediction against ground-truth instances.
This command can execute an independent assessment of a prediction set against a ground-truth set,
it does not require a NLR model that other Orchestrator commands may need.

```
USAGE
  $ bf orchestrator:assess

OPTIONS
  -d, --debug                     Print debugging information during execution.
  -h, --help                      Orchestrator 'assess' command help.
  -i, --in=in                     Path to a ground-truth label file, or comma-separated paths to
                                  a collection of files -- most uselful for crosss-valiaton.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --prediction=prediction     Path to a prediction label file, or comma-separated paths to
                                  a collection of files -- most uselful for crosss-valiaton.

DESCRIPTION

  The "assess" command compares a prediction file against a ground-truth file, then
  generates two detailed evaluation reports, one on intent prediction and the other entity, along with some
  auxiliary files.
  The input files can be in LU, LUIS, QnA Maker, TSV, or a JSON label array format described below.

  This command intends to provide a comprehensive and consistent multi-class model evaluation tool in
  order to avoid teams reporting their own inconsistent evaluation metrics, especially in a contest
  evaluating competitive technology or models. Below are some sources of evaluation inconsistencies if
  evaluation were conducted and metrics reported by the teams themselves:

  1)  Metric - one team may report Micro-Average, Macro Average, or else. As shown below,
        there can be many ways in computing a metric average, and
        the discrepancy can be huge using different averaging formulations.
  2)  Datasets – even though every party tests on the same dataset source, the dataset might diverge
        after a while after some data massaging, sometimes due to processing errors or filtering logic.
        Some teams may prefer some datasets, but not others, for their particular technology or models.
  3)  Data processing – some test dataset can contain duplicate utterances and labels.
        De-duplicate or not can affect final metric calculation. 
  4)  Confusion matrix formulation – what is a TP, FP, TN, or FN? 
        Even though their textbook definition is clear, they can still be up to interpretation
        in real world scenarios. For example, TN may not make sense in evaluating entity extracting.
  5)  Label interpretation – Sometimes people might ignore some test results if their prediction
        scores are too low. We should have a consistent way to include those predictions. On entity, some
        people may choose to evaluate based on per-token tags, instead of per-entuty-mention. 
  6)  Label processing – what is an UNKNOWN label? Different teams may have their unique strategies
        in processing empty, UNKNOWN, or never-seen-before labels in the ground-truth and prediction files.
  7)  Evaluation Tool – every team has their own tools that might not be consistent in metric computation.

  The "assess" command aims to address these issues:

  1)  Metric -- the "assess" command calculates as many average/aggregate metrics as we can think of.
      Which metric to focus on for decision-making is up to an evaluation committee or stakeholder.
      The tool has no bias, even though each party might have its favorites for its own agenda.
  2)  Datasets -- it's necessary to create a dataset repo for the community to share
      ground-truth datasets and predictions. Again it’s up to an evaluation committee or individual party to choose the
      evaluation datasets (and performance metrics) compatible with their projects and scenarios.
  3)  Data processing – this BF-orchestrator evaluation package provides consistent logic in processing datasets.
      For example, it does de-duplication, so an utterance and its label won’t contribute more than once
      in metric calculation.
  4)  Confusion matrix formulation – again, this BF evaluation package provides consistent formulation logic in
      intepreting the 4 confusion matrix cells.
      For example, entity evaluation does not have TN.
  5)  Label interpretation – again, consistent is key and this "assess" command does not silently
      ignore some test results for whatever reasons. Every test instance should contribute to
      metric calculation unless they are spurious – due to processing mistakes by whoever prepared it. 
  6)  Label processing – this BF-Orchestrator package pre-processes labels and treats
      an utterance’s empty, None, and never-seen-before labels as UNKNOWN. Since BF-Orchestrator allows
      multi-label intents for utterances, UNKNOWN is stripped if it con-exists with known labels
      for an utterance.
  7)  Evaluation Tool – BF-Orchestrator has been released to the world (through NPM), everyone
      in the world can run it, file a bug or PR to improve it.
      It’s not a script hidden in someone's laptop or some team repo.

  Besides addressing these evaluation inconsistency issues, the "assess" command also produces a
  comprehensive metric report as well as label and utterance distributions.

INPUT

  The input ground-truth and predictions files can be in LU, LUIS, QnA Maker, TSV or a JSON array format.
  The TSV file format only supports intent labels and it must have 2 columns, 'labels' and 'utterance',
  sepatated by a TAB. The 'labels' column can contains multiple labels delimited by camma.

  For entitiy labels, a user can choose LU, LUIS, or a JSON array format
  that each entry contains a labeled utterance following the schema and example shown below.
  In the array, each JSON entry has a "text" attribute for an utterance. The utterance can have an array pf
  "intents." The utterance can also has an array of "entities."
  Each entity entry contains an "entity" attribute for its name, a "startPos" attribute indicating the offset
  of the entry in the utterance, and a "endPos" attribute for the final location of the entity
  in the utterance. The entity can have some optional fields, such as a "text" attribute
  for a entity mention within the utterance, however this attribute is only for debugging purpose and not consumed
  for the "assess" command.

    [
    {
      "text": "I want to see Medal for the General",
      "intents": [
        "None"
      ],
      "entities": [
        {
          "entity": "movie_name",
          "startPos": 14,
          "endPos": 34,
          "text": "Medal for the General"
        }
      ]
    },
    ...
    ]

REPORT

  The "assess" command reads the input ground-truth and prediction JSON files and generates
  distributions of the utterances and their labels. It also groups each utterance's
  ground-truth and prediction intent and entity labels together, compares them, and determines if
  a prediction is in the ground-truth or vice versa. Using these analyese, the "assess" command
  generates HTML reports and some auxiliary files at the end.
  One report is for intent evaluation and the other for entity.

  Each report has the following sections:

  >  Ground-Truth Label/Utterancce Statistics - ground-truth label and utterance statistics and distributions.
  >  Ground-Truth Duplicates - tables of ground-truth utterances with multiple labels and exact utterance/label duplicates.
  >  Prediction Label/Utterancce Statistics - prediction label and utterance statistics and distributions.
  >  Prediction Duplicates - tables of prediction utterances with multiple labels and exact utterance/label duplicates.
  >  Misclassified - utterances with false-positive and false-negative predictions.
  >  Metrics - confisuon matrix metrics.

  In the Metrics section, the Orchestrator "assess" command first generates a series of per-label
  binary confusion matrices.
  Each binary confusion matrix is comprised of 4 cells: true positive (TP), false positive (FP), true negative (TN),
  and false negative (FN). Using these 4 cells, Orchestrator can compute several other confusion
  matrix metrics, including precision, recall, F1, accuracy, and support, etc.
  Please reference https://en.wikipedia.org/wiki/Confusion_matrix for details.

  Notice that the logic constructing a per-label confusion matrix is a little diffenent between intent
  and entity labels. Here are the logic outlines:

  Intent - the "assess" command iterates through one ground-truth utterance at a time
        and compare its ground-truth intent array and prediction intent array. If a label is in
        both arrays, then this utterance is a TP for the label's confusion matrix. If a label only exists in
        the prediction array, then it's a FP for the predicted label's confusion matrix. Similarly
        if a label only exists in the ground-truth array, then it's a FN for the ground-truth label's confusion
        matrix. For any other labels, the utterance is a TN for their confusion matrices.

  Entity - the "assess" command iterates through one ground-truth utterance at a time
        and compare its ground-truth entity array and prediction entity array.
        If an entity mention exists in both array, then it's a TP for the entity label's confusion matrix.
        An entity mention is comprised of the entity name (label), start position in the utterance, and the length
        of the entity mention. An entity mention is considered a match to another only if these three components
        are exactly the same.
        FP and FN logic is similar to those for intent. However, there is no TN for evaluating entity mentions
        as there can be too many possible entity mention candidates for an utterance when consider the start-position
        and entity length.
        On the other hand, number of intent labels for an utterance is usually one or a small number.
        It is still possible to define a custom TN logic, such as
        an entity label is a TN if it does not exist in an utterance's ground-truth or prediction label arrays at all.
        However as some important metrics such as precision, recall, and their combination (F1) do not rely on TN,
        so that it's really not necessary to collect TN for evaluating entity predictions.

  By the way, sometimes an erroneous prediction file can contain some labeled utterances not in the ground-truth
  file. These utterances are called spurious, and they will be listed under the "Prediction Duplicates" tab
  in an evaluation report called "Spurious utterance and label pairs."

  Once the serial of per-label binary confusion matrices are built, there are plenty of
  per-label metrics, which can then be aggregated using several diverse averaging schemes.
  An evaluation report's "Metrics" tab contains several of them:

  0) Micro-Average - Orchestrator is essentially a multi-class ML learner and model, so evaluation can also be expressed
        as a multi-class confusion matrix, besides the series of binary per-label confusion matrices
        mentioned above. In such a multi-class confusion matrix, every prediction is a positive and
        there is no negative. The diagonal cells of this multi-class confusion matrix are
        the TPs. The micro-average metric is the ratio of the sum of TPs over total. Total is the sum
        of all the supports (#positives) aggregated from the series of binary confusion matrices.
  1) Micro-First-Quartile - use the series of binary confusion matrices, sort them by a metric (e.g., F1) value,
        and crate an bucket array that each bucket contain the per-label binary confusion matrix metric value as well
        as the per-label support. From this metric-support array, the micro-first-quartile metric is
        the metric value from the entry at the first quartile position in the bucket array.
  2) Micro-Median - similar to Micro-First-Quartile, but at the second-quartile position, i.e., median.
  3) Micro-Third-Quartile - similar to Micro-First-Quartile, but at the third-quartile position.
  4) Macro-First-Quartile - use the series of binary confusion matrices, sort them by a metric (e.g., F1) value,
        and crate a simple array of the per-label binary confusion matrix metrics. From this metric array, the
        macro-first-quartile metric is the metric value at the first quartile position.
  5) Macro-Median - similar to Macro-First-Quartile, but at the second-quartile position, i.e., median.
  6) Macro-Third-Quartile - similar to Macro-First-Quartile, but at the third-quartile position.
  7) Summation Micro-Average - the second way coalescing the series of binary confusion matrices into one is by
        summing up their TP, FP, TN, FN numbers. These 4 summations are then formed as one binary confusion
        matrix and can be used to calculate overall precision, recall, F1, and accuracy.
  8) Macro-Average - another way coalescing the series of binary confusion matrices simply takes
        arithmetic average of every metrics individually. The denominator for computing the averages
        is the number of labels existed in the ground-truth set.
  9) Summation Macro-Average - While macro-average takes a simple arithmetic average on every metrics.
        Summation macro-average only takes the average on the 4 confusion matrix cells, TP, FP, TN, and FN.
        Precision, recall, F1, and accuracy are then calculated by the 4 averaged cells.
  10) Positive Support Macro-Average - some prediction file may not contain all the ground-truth utterances
        and may lack predictions for some ground-truth labels completely. The averaging denominator for this metric
        uses the number of prediction labels, i.e., number of the labels with a greater-than-zero support.
  11) Positive Support Summation Macro-Average - this metric is similar to 3), but use 4)'s denominator.
  12) Weighted Macro-Average - this metric averaging approach takes an weighted average of the series of binary
        per-label confusion matrices. The weights are the per-label prevalences, which are listed in the
        "Ground-Truth Label/Utterancce Statistics" tab.
  13) Weighted Summation Macro-Average - similar to 6), but the weighted average only applies to
        the 4 confusion matrix cells. Weighted TP, FP, TN, FN are then used to calculate precision, recall, F1, and
        accuracy.
  14) Multi-Label Exact Aggregate - Orchestrator supports evaluating multi-label intents for each utterance.
        I.e., an utterance can belong to more than one categories (intents). For a multi-intent application, a model can
        actually generate spurious (too many) intent predictions that can still boost the "per-label" metrics
        described thus far. In a "per-label" metric, every label (an instance can have more than one label)
        can contribute to metric computation, therefore some instances may contribute more to metric
        calculation more then others.
        To counter this problem, Multi-Label Exact Aggreagate is a "per-instance" metric that it builds
        a binary confusion matrix directly and an instance can only contribute to metric computation once
        disregard the number of labels it has.
        An utterance is only a TP if a non-empty prediction's intent array is exactly equal to the ground-truth array. If a prediction's intent array contains at least one label not in the ground-truth array,
        then this utterance is a FP. Then, if an utterance's ground-truth intent array contains at least
        one label not in the prediction intent array, then this utterance is a FN. A TN only happens if both arrays
        are empty. Notice that this metric only applies to multi-intent predictions, it is not calculated for
        evaluating entity predictions.
  15) Multi-Label Subset Aggregate - Similar to Multi-Label Exact Aggregate, but this metric's TP logic is less
        restrictive.
        An utterance is only a TP if a prediction's intent array is a non-empty subset of the ground-truth array. If a prediction's intent array contains at least one label not in the ground-truth array,
        then this utterance is a FP. If an utterance's prediction intent array is empty while it's not
        for the ground-truth intent array, then this utterance is a FN. A TN only happens if both arrays
        are empty. Notice that this metric only applies to multi-intent predictions, it is not calculated for
        evaluating entity predictions.

EXAMPLE
```

_See code: [src\commands\orchestrator\assess.ts]https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/assess.ts)_

## `bf orchestrator:build`

Creates Orchestrator snapshot (.blu) file and Orchestrator dialog definition file (optional) for each lu file in input folder.

```
USAGE
  $ bf orchestrator:build

OPTIONS
  -d, --debug
  -f, --force        If --out flag is provided with the path to an existing file, overwrites that file.
  -h, --help         Orchestrator build command help
  -i, --in=in        Path to lu file or folder with lu files.
  -m, --model=model  Path to Orchestrator model directory.
  -o, --out=out      Path where Orchestrator snapshot/dialog file(s) will be placed. Default to current working directory.
  --dialog           Generate multi language or cross train Orchestrator recognizers.

EXAMPLE

       $ bf orchestrator:build 
       $ bf orchestrator:build --in ./path/to/lufile/or/folder/
       $ bf orchestrator:build --in ./path/to/file/ --out ./path/to/output/
       $ bf orchestrator:build --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory
```

_See code: [src\commands\orchestrator\build.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/build.ts)_

## `bf orchestrator:create`

Create orchestrator snapshot (.blu) file from .lu/.qna files, which represent bot modules

```
USAGE
  $ bf orchestrator:create

OPTIONS
  -d, --debug
  -f, --force        If --out flag is provided with the path to an existing file, overwrites that file.
  -h, --help         Orchestrator create command help

  -i, --in=in        The path to source label files from where orchestrator example file will be created from. Default
                     to current working directory.  Valid file extensions are lu, .qna, .json and .tsv.

  -m, --model=model  Path to Orchestrator model directory.

  -o, --out=out      Path where generated orchestrator example file will be placed. Default to current working
                     directory.

  --hierarchical     Add hierarchical labels based on lu/qna file name.

EXAMPLE

       $ bf orchestrator:create 
       $ bf orchestrator:create --in ./path/to/file/
       $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/
       $ bf orchestrator:create --in ./path/to/file/ --out ./path/to/output/ --model ./path/to/model/directory
```

_See code: [src\commands\orchestrator\create.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/create.ts)_

## `bf orchestrator:evaluate`

Create Orchestrator leave-one-out cross validation (LOOCV) evaluation report on a previously generated .blu file

```
USAGE
  $ bf orchestrator:evaluate

OPTIONS
  -a, --ambiguous=threshold       Optional ambiguous analysis threshold. Default to 0.2.
  -d, --debug                     Print debugging information during execution.
  -h, --help                      Orchestrator 'evaluate' command help.
  -i, --in=in                     Path to a previously created Orchestrator .blu file.
  -l, --low_confidence=threshold  Optional low confidence analysis threshold. Default to 0.5.
  -m, --model=model               Optional directory or a config file hosting Orchestrator model files.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --multi_label=threshold     Optional plural/multi-label prediction threshold, default to 1,
                                  i.e., only max-score intents are predicted
  -u, --unknown=threshold         Optional unknown label threshold, default to 0.3.

DESCRIPTION

  The 'evaluate' command can execute a leave-one-out-cross-validation (LOOCV) analysis
  on a model and its example snapshot set. It also generates a detailed evaluation report
  with the following sections:

  >  Intent/utterancce Statistics - intent and utterance statistics and distributions.
  >  Duplicates - tables of utterance with multiple intents and exact utterance/intent duplicates.
  >  Ambiguous - ambiguous predictions that there are some other intent predictions whose
     scores are close to the correctly predicted intents. Ambiguity closeness is controlled by the "ambiguous" parameter, default to 0.2. I.e., if there is a prediction whose score is within 80% of
     the correctly predicted intent score, then the prediction itself is considered "ambiguous."
  >  Misclassified - utterance's intent labels were not scored the highest.
  >  Low Confidence - utterance intent labels are scored the highest, but they are lower than a threshold.
     This threshold can be configured through the "low_confidence" parameter, the default is 0.5.
  >  Metrics - test confisuon matrix metrics. Please reference the "assess" command description for details.

EXAMPLE
```

_See code: [src\commands\orchestrator\evaluate.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/evaluate.ts)_

## `bf orchestrator:nlr:get`

Gets Orchestrator model

```
USAGE
  $ bf orchestrator:nlr:get

OPTIONS
  -o, --out        Optional. Path to where Orchestrator model will be saved to. Default to current working directory.
  --versionId      Optional. Model version to download -- reference nlr:list output for options.  If not specified, default model will be downloaded.
  -h, --help       Show CLI help
```

_See code: [src\commands\orchestrator\nlr\get.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/nlr/get.ts)_


## `bf orchestrator:nlr:list`

Lists all Orchestrator model versions

```
USAGE
  $ bf orchestrator:nlr:list

OPTIONS
  -r, --raw        Optional. Raw output
  -h, --help       Show CLI help
```

_See code: [src\commands\orchestrator\nlr\list.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/nlr/list.ts)_

## `bf orchestrator:predict`

Returns score of given utterance using previously created orchestrator examples

```
USAGE
    $ bf orchestrator:predict --out=<analysis-and-output-folder> --model=<model-and-config-folder>[--in=<previous-generated-blu-training-set-file>]

OPTIONS
  -a, --ambiguous=threshold       Optional ambiguous analysis threshold. Default to 0.2.
  -d, --debug                     Print debugging information during execution.
  -h, --help                      Orchestrator 'predict' command help.
  -i, --in=in                     Optional path to a previously created Orchestrator .blu file.
                                  This argument is optional users can use the 'predict' command
                                  to start an Orchestrator snapshot from scratch. The 'n' commandlet
                                  can save the utterance labels into a snapshot (.blu) file.
  -l, --low_confidence=threshold  Optional low confidence analysis threshold. Default to 0.5.
  -m, --model=model               Directory or a config file hosting Orchestrator model files.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --multi_label=threshold     Optional plural/multi-label prediction threshold, default to 1,
                                  i.e., only max-score intents are predicted
  -u, --unknown=threshold         Optional unknown label threshold, default to 0.3.

DESCRIPTION

  The 'predict' command is an interactive session that a user can access an Orchestrator model in real-time
  doing following:
    1) Predict the intent of an input utterance using the 'p' commandlet.
    2) Analyze a model example set, by executing the 'v' (validation) commandlet and produce an evaluation
       report in real-time.
    3) Add, remove, or change the intents of an input utterace using the 'a', 'r', and 'c' commandlets,
       respectively. Users can reference a validation report and choose an ambiguous, misclassified, or
       low-confidence utterance and change their intent labels.
    4) Remove some labels completely from the model example set using the 'rl' commandlet.
    5) Create a new model example set snapshot using the 'n' commandlet.

  Below is a list of the commandlets that can be issued during a 'predict' session.

  Commandlets: h, q, d, s, u, cu, i, ci, ni, cni, q, p, v,
               vd, va, vm, vl, vat, vlt, vmt, vut, a, r, c, rl, n
    h   - print this help message
    q   - quit
    d   - display utterance, intent label array inputs, Orchestrator config,
          and the label-index map
    s   - show label-utterance statistics of the model examples
    u   - enter a new utterance and save it as the "current" utterance input
    cu  - clear the "current" utterance input
    i   - enter an intent and add it to the "current" intent label array input
          (can be an index for retrieving a label from the label-index map)
    ci  - clear the "current" intent label array input
    ni  - enter an intent and add it to the "new" intent label array input
          (can be an index for retrieving a label from the label-index map)
    cni - clear the "new" intent label array input
    f   - find the "current" utterance if it is already in the model example set
    p   - make a prediction on the "current" utterance input
    v   - validate the model and save analyses (validation report) to
          "experiment_predicting_va\orchestrator_predicting_set_summary.html"
    vd  - reference a validation Duplicates report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    va  - reference a validation Ambiguous report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    vm  - reference a validation Misclassified report and enter an index
          (previously generated by the "v" command)
          for retrieving utterance/intents into "current"
    vl  - reference a validation LowConfidence report
          (previously generated by the "v" command) and enter an index
          for retrieving utterance/intents into "current"
    vat - enter a new validation-report ambiguous closeness threshold
    vlt - enter a new validation-report low-confidence threshold
    vmt - enter a new multi-label threshold
    vut - enter a new unknown-label threshold
    a   - add the "current" utterance and intent labels to the model example set
    r   - remove the "current" utterance and intent labels from the model example set
    c   - remove the "current" utterance's intent labels and then
          add it with the "new" intent labels to the model example set
    rl  - remove the "current" intent labels from the model example set
    n   - create a new snapshot of model examples and save it to
          "experiment_predicting_va\orchestrator_predicting_training_set.blu"

EXAMPLE

      $ bf orchestrator:predict --out=resources\data\Columnar\PredictOutput --model=resources\data\Columnar\ModelConfig --in=resources\data\Columnar\Email.blu

      Notice that inside the ".../ModelConfig" directory, there is a "config.json" that specifies downloaded model files
      among other hyper parameters. Here is an example: 
      {
        "LoadModel": true,
        "VocabFile": "vocab.json",
        "MergeFile": "merges.txt",
        "ModelFile": "traced_model.onnx",
        "Version": "1.0.0-pretrained.20200729.microsoft.dte.en.onnx"
      }


```

_See code: [src\commands\orchestrator\predict.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/predict.ts)_

## `bf orchestrator:test`

Test utterance/label samples from an input file and create an evaluation report

```
USAGE
  $ bf orchestrator:test

OPTIONS
  -a, --ambiguous=threshold       Optional ambiguous analysis threshold. Default to 0.2.
  -d, --debug                     Print debugging information during execution.
  -h, --help                      Orchestrator 'test' command help.
  -i, --in=in                     Path to a previously created Orchestrator .blu file.
  -l, --low_confidence=threshold  Optional low confidence analysis threshold. Default to 0.5.
  -m, --model=model               Directory or a config file hosting Orchestrator model files.
  -o, --out=out                   Directory where analysis and output files will be placed.
  -p, --multi_label=threshold     Optional plural/multi-label prediction threshold, default to 1,
                                  i.e., only max-score intents are predicted
  -t, --test=test                 Path to a test file, or comma-separated paths to
                                  a collection of test files -- most uselful for crosss-valiaton.
  -u, --unknown=threshold         Optional unknown label threshold, default to 0.3.

DESCRIPTION
  The 'test' command can test an Orchestrator model and example set on an input utterance/intent file.

EXAMPLE
```
_See code: [src\commands\orchestrator\test.ts](https://github.com/microsoft/botframework-cli/blob/beta/packages/orchestrator/src/commands/orchestrator/test.ts)_
<!-- commandsstop -->