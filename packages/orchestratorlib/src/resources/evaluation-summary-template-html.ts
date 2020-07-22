﻿/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class EvaluationSummaryTemplateHtml {
    public static readonly html: string =`
<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title></title>
    <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/9.6.0/css/fabric.min.css" />
    <link rel="stylesheet" href="https://ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/css/bootstrap.min.css" />
    <style>
        td, th {
            padding-bottom: 0px !important;
            padding-top: 0px !important;
            padding-right: 15px !important;
            margin: 0 !important;
        }
        .table > tbody > tr > td, .table > tbody > tr > th, .table > tfoot > tr > td, .table > tfoot > tr > th, .table > thead > tr > td, .table > thead > tr > th {
            border-top: none;
            border-bottom: 1px solid #ddd;
        }
        .navbar {
            border: none;
            min-height: 48px;
        }
        .navbar-inverse {
            background-color: #0078D7 !important;
            color: #fff !important;
        }
        .navbar-header {
            padding-top: 10px;
        }
        .navbar-header a {
            color: #fff;
        }
        #orchestratorName {
            margin-right: 150px;
        }
        .nav-pills > li > a {
            border-radius: 0;
            padding-bottom: 0px;
            padding-left: 0px;
            padding-right: 0px;
            margin-right: 15px;
            color: #333;
        }
        .nav-pills > li.active > a,
        .nav-pills > li.active > a:hover,
        .nav-pills > li.active > a:focus {
            color: #333;
            background-color: #fff !important;
            font-weight: 600 !important;
            border-bottom-color: #0078D7;
            border-bottom-style: solid;
            border-bottom-width: 2px;
        }
        .nav-pills > .active > a > .badge {
            background-color: #fff !important;
            font-weight: 600 !important;
        }
        .nav-pills > li:hover > a:hover {
            background-color: #fff !important;
        }
    </style>
</head>
<body class="ms-Fabric ms-font-m">
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header ms-fontSize-l">
                <span id="orchestratorName">{APP_NAME}</span>
                <!--
                <span><a href="https://{PORTAL_URL}/applications/{APP_ID}/versions/{VERSION}/dashboard" target="_blank">LUIS Application ID: {APP_ID}</a></span>
                -->
            </div>
        </div>
    </nav>
    <div style="clear:both"></div>
    <div class="container body-content" style="margin-top:60px">
        <span class="ms-fontSize-xl ms-fontWeight-semibold">Orchestrator Evaluation Summary</span>
        <!--
        <span style="float:right"><a href="https://{PORTAL_URL}/applications/{APP_ID}/versions/{VERSION}/dashboard" target="_blank">View in LUIS portal</a></span>
        -->
        <div>
            <p>{EVAL_SUMMARY}</p>
            <p>To improve orchestrator, please update the source models and retrain the orchestrator model by running the command "orchestrator refresh".</p>
        </div>
        <br />
        <ul class="nav nav-pills ms-fontSize-mPlus ms-fontWeight-semibold" id="modelAnalysis" role="tablist" style="padding-bottom:10px">
            <li class="nav-item active">
                <a class="nav-link active" id="intentutterancestatistics-tab" data-toggle="tab" href="#intentutterancestatistics" role="tab" aria-controls="intentutterancestatistics" aria-selected="true"><strong>Intent Statistics</strong></a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" id="duplicates-tab" data-toggle="tab" href="#duplicates" role="tab" aria-controls="duplicates" aria-selected="true"><strong>Duplicates</strong></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="ambiguous-tab" data-toggle="tab" href="#ambiguous" role="tab" aria-controls="ambiguous" aria-selected="false"><strong>Ambiguous</strong></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="misclassified-tab" data-toggle="tab" href="#misclassified" role="tab" aria-controls="misclassified" aria-selected="false"><strong>Misclassified</strong></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="lowconfidence-tab" data-toggle="tab" href="#lowconfidence" role="tab" aria-controls="lowconfidence" aria-selected="false"><strong>Low Confidence</strong></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="modelevaluation-tab" data-toggle="tab" href="#modelevaluation" role="tab" aria-controls="modelevaluation" aria-selected="false"><strong>Metrics</strong></a>
            </li>
            <!--
            <li class="nav-item">
                <a class="nav-link" id="modelevaluationtopposition-tab" data-toggle="tab" href="#modelevaluationtopposition" role="tab" aria-controls="modelevaluationtopposition" aria-selected="false"><strong>Top @Position Metrics</strong></a>
            </li>
            -->
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="intentutterancestatistics" role="tabpanel" aria-labelledby="intentutterancestatistics-tab">
                <p>Intents and utterances statistics</p>
                <p>
                    {INTENTUTTERANCESTATISTICS}
                </p>
            </div>
            <div class="tab-pane" id="duplicates" role="tabpanel" aria-labelledby="duplicates-tab">
                <p>Multi-label utterances and duplicate utterance/intent pairs. The utterance/intent pairs in the second table below have been entered more than one times in the source file.
                   It's not a serious problem as they will be deduped.
                </p>
                <p>
                    {DUPLICATES}
                </p>
            </div>
            <div class="tab-pane" id="ambiguous" role="tabpanel" aria-labelledby="ambiguous-tab">
                <p>Utterance(s) whose intents were correctly predicted (as a subset of the labeled intents), but there are also other intents predicted with high scores</p>
                <p>
                    {AMBIGUOUS}
                </p>
            </div>
            <div class="tab-pane" id="misclassified" role="tabpanel" aria-labelledby="misclassified-tab">
                <p>Utterance(s) yielding predicted intent that is not originally labeled with</p>
                <p>
                    {MISCLASSIFICATION}
                </p>
            </div>
            <div class="tab-pane" id="lowconfidence" role="tabpanel" aria-labelledby="lowconfidence-tab">
                <p>Utterance(s) whose intents were correctly predicted (as a subset of the labeled intents), but the prediction score is low</p>
                <p>
                    {LOWCONFIDENCE}
                </p>
            </div>
            <div class="tab-pane" id="modelevaluation" role="tabpanel" aria-labelledby="modelevaluation-tab">
                <p>Overall model performance and links to machine learning model evaluation charts and metrics</p>
                <p>
                    {MODELEVALUATIONOVERALL}
                </p>
                <p>
                    {MODELEVALUATION}
                </p>
                <p>
                    {CROSSENTROPY}
                </p>
            </div>
            <!--
            <div class="tab-pane" id="modelevaluationtopposition" role="tabpanel" aria-labelledby="modelevaluationtopposition-tab">
                <p>Overall top-position multi-class confusion matrix evaluation metrics</p>
                <p>
                    {MODELEVALUATIONTopPositionMetrics}
                </p>
                <p>
                    {MODELEVALUATIONTopPositionPerClassMetrics}
                </p>
            </div>
            -->
        </div>
        <br /><br />
    </div>
    <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-2.2.0.min.js"></script>
    <script src="https://ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/bootstrap.min.js"></script>
</body>
</html>
`;
}