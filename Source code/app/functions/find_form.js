exports.findForm = (req, res, Form, category, Op) => {

    const id = req.query.staffId || req.query.id;
    if (!id) return res.status(401).send("staff id or form id not provided");
    if (category == "assessment")
        return (Form.findOne({
            attributes : { exclude: ["qualification","probationaryResult","proposal","address","phone"]},
            where: {
                [Op.and]: [{
                        staffId: id
                    },
                    {
                        formCategory: category
                    }
                ]
            }
        })) || (Form.findOne({
            attributes : { exclude: ["qualification","probationaryResult","proposal","address","phone"]},
            where: {
                [Op.and]: [{
                        staffId: id
                    },
                    {
                        formCategory: category
                    }
                ]
            }
        }));
    else
        return (Form.findOne({
            where: {
                attributes : { exclude: ["contentAssessment", "assessmentResult"]},
                [Op.and]: [{
                        staffId: id
                    },
                    {
                        formCategory: category
                    }
                ]
            }
        })) || (Form.findOne({
            attributes : { exclude: ["contentAssessment", "assessmentResult"]},
            where: {
                [Op.and]: [{
                        staffId: id
                    },
                    {
                        formCategory: category
                    }
                ]
            }
        }));
}